import 'dotenv';
import { Injectable } from '@nestjs/common';
import { PluginconfigService } from 'src/pluginconfig/pluginconfig.service';
import { TokenService } from '../token/token.service';
import { ProductRepository } from './product.repository';
import { Connection } from 'typeorm';
import { ClassificationRepository } from 'src/classification/classification.repository';
import { MarkRepository } from 'src/mark/mark.repository';
import { SkuLocalVariationService } from 'src/sku-local-variation/sku-local-variation.service';
import * as moment from 'moment';
import { PayloadDto } from 'src/dtos/payload.dto';

@Injectable()
export class ProductService {
  private productRepository: ProductRepository;
  private classificationRepository: ClassificationRepository;
  private markRepository: MarkRepository;
  constructor(
    private readonly connection: Connection,
    private pluginconfigService: PluginconfigService,
    private tokenService: TokenService,
    private skuLocalVariationService: SkuLocalVariationService,
  ) {
    this.productRepository =
      this.connection.getCustomRepository(ProductRepository);
    this.classificationRepository = this.connection.getCustomRepository(
      ClassificationRepository,
    );
    this.markRepository = this.connection.getCustomRepository(MarkRepository);
  }

  async init(pluginspaceId?: string | number): Promise<any> {
    const pluginconfig = await this.pluginconfigService.getConfigTemplate(
      pluginspaceId,
    );
    if (
      pluginconfig == undefined ||
      Object.getOwnPropertyDescriptor(pluginconfig, 'code') != undefined
    ) {
      return {
        Dados:
          'Não foi possivel obter dados de configuração, plugin de configuração inexistente',
        message: 'error',
        success: false,
      };
    }
    return pluginconfig;
  }

  async do(
    pluginspaceId?: string | number,
    ip?: string,
    payloadDto?: PayloadDto,
  ): Promise<any> {
    const plugins = await this.init(pluginspaceId);
    console.time('timer_p');
    console.log('Iniciando Produtos');
    console.log('Pluginspaces ', plugins.length);
    for await (const plugin of plugins) {
      try {
        const content = plugin.content;
        console.log('----------------------');
        console.log(
          'Produtos de',
          '\x1b[43m',
          '\x1b[31m',
          plugin.name,
          '\x1b[0m',
          plugin.pluginspaceId,
          '[',
          content.active
            ? content.active == '1'
              ? `\x1b[34m Plugin Ativado \x1b[0m`
              : `\x1b[31m Plugin Desativado \x1b[0m`
            : `\x1b[31m Desativado \x1b[0m`,
          ']',
          '[',
          content.ableProducts
            ? content.ableProducts == '1'
              ? `\x1b[34m Produto Ativado \x1b[0m`
              : `\x1b[31m Produto Desativado \x1b[0m`
            : `\x1b[31m Desativado \x1b[0m`,
          ']',
        );
        if (content.active == '1')
          if (content.ableProducts == '1')
            await this.updateex(plugin, payloadDto);
      } catch (error) {
        console.timeEnd('timer_p');
        console.log(error);
      }
    }
    console.timeEnd('timer_p');
    console.log('\x1b[47m fim \x1b[0m');
    console.log('----------------------');
    return {
      Dados: plugins,
      message: 'OK',
      success: true,
    };
  }

  async updateex(plugin: any, payloadDto: PayloadDto): Promise<any> {
    try {
      const token = await this.tokenService.token(plugin);
      if (token.success == false) return;
      const pluginspaceId = plugin.pluginspaceId;
      const content = plugin.content;
      let newProduct;

      const levels = ['DSC', 'DS', 'DC', 'SC'];
      const level = content.order_classification
        .replace(/[^a-zA-Z ]/g, '')
        .toUpperCase();

      if (!levels.includes(level)) {
        console.log(
          '\x1b[43m',
          '\x1b[31m',
          `A sequência [${level}] não é válida para os classificadores. Utilize ${levels}`,
          '\x1b[0m',
        );
        return {
          dados: `A sequência [${level}] não é válida para os classificadores. Utilize ${levels}`,
          message: 'error',
          success: false,
        };
      }

      // Cria um array com o range especificado (de 1 até 1000)
      const range = (from, to, step) =>
        [...Array(Math.floor((to - from) / step) + 1)].map(
          (_, i) => from + i * step,
        );
      const arr = range(1, 300, 1);
      for await (const i of arr) {
        const params = await this.init(plugin.pluginspaceId);
        if (params[0].content.ableProdutcs == '0') {
          console.log(`\x1b[41m\x1b[37m CARGA DE PRODUTOS DESATIVADO \x1b[0m`);
          break;
        }
        const items = await this._load(plugin, token.value, i, payloadDto);
        if (items.length > 0) {
          console.log(
            'Produtos encontrados: ',
            items.length,
            '|',
            'Dias:',
            content.days,
          );
          let index = 1;
          for await (const item of items) {
            // Busca o produto
            const product = await this.productRepository.findByCode(
              item.productSKUId,
              pluginspaceId,
            );

            const classificationDB =
              await this.classificationRepository.findById(
                product.classificationId,
                pluginspaceId,
              );

            let classification;
            // Retorna o código da marca
            const mark = await this.markRepository.findByCode(
              item.brandId,
              pluginspaceId,
            );

            if (item.hasOwnProperty('departmentId')) {
              // Retorna a classificação
              const searchClassification = this.setClassification(
                level,
                item.departmentId,
                item.sectionId,
                item.categoryId,
              );

              classification =
                await this.classificationRepository.findByCodeParent(
                  searchClassification.code,
                  searchClassification.parent,
                  pluginspaceId,
                );
            } else {
              classification = await this.classificationRepository.findByCode(
                item.categoryId + '-' + item.sectionId,
                pluginspaceId,
              );
            }

            const data = {
              pluginspaceId: pluginspaceId,
              userId: 341,
              name: item.name,
              description:
                item.description != '' ? item.description : item.name,
              technicalSpecification: item.technicalInformation,
              order: 0,
              status: true,
              code: item.productSKUId, //item.id,
              classificationId: classification
                ? classification.id
                : classificationDB.id,
            };
            // if (classification)
            //   Object.assign(data, { classificationId: classification.id });
            if (mark) Object.assign(data, { markId: mark.id });

            if (product) {
              if (
                data.name != product.name ||
                data.code != product.code ||
                data.technicalSpecification != product.technicalSpecification ||
                data.description != product.description ||
                data.classificationId != product.classificationId
              ) {
                await this.productRepository.update(product.id, data);
                console.log(
                  index.toString().padStart(3, ' '),
                  `Produto \x1b[36m atualizado \x1b[0m`,
                  data.name.padEnd(50, ' '),
                  `${plugin.name} - ${plugin.pluginspaceId}`,
                );
              } else {
                console.log(
                  index.toString().padStart(3, ' '),
                  `Produto \x1b[42m\x1b[31m inalterado \x1b[0m`,
                  data.name.padEnd(50, ' '),
                  `${plugin.name} - ${plugin.pluginspaceId}`,
                );
              }
            } else {
              newProduct = await this.productRepository.create(data).save();
              console.log(
                index.toString().padStart(3, ' '),
                `Produto \x1b[32m criado \x1b[0m`,
                data.name.padEnd(50, ' '),
                `${plugin.name} - ${plugin.pluginspaceId}`,
              );
            }

            index++;

            await this.skuLocalVariationService.update(
              plugin,
              pluginspaceId,
              product ? product : newProduct,
              item,
            );
          }
        } else {
          console.log('Sem resultados');
          break;
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  setClassification(
    pattern: string,
    departmentId: string,
    sectionId: string,
    categoryId: string,
  ) {
    if (pattern === 'DSC') {
      return {
        code: departmentId + '-' + sectionId + '-' + categoryId,
        parent: departmentId + '-' + sectionId,
      };
    }
    if (pattern === 'DS') {
      return {
        code: departmentId + '-' + sectionId,
        parent: departmentId,
      };
    }
    if (pattern === 'DC') {
      return {
        code: departmentId + '-' + sectionId + '-' + categoryId,
        parent: departmentId,
      };
    }
    if (pattern === 'SC') {
      return {
        code: departmentId + '-' + sectionId + '-' + categoryId,
        parent: departmentId + '-' + sectionId,
      };
    }
  }

  async update(plugin: any, payloadDto: PayloadDto): Promise<any> {
    try {
      const token = await this.tokenService.token(plugin);
      if (token.success == false) return;
      const pluginspaceId = plugin.pluginspaceId;
      const content = plugin.content;
      let newProduct;

      // Cria um array com o range especificado (de 1 até 1000)
      const range = (from, to, step) =>
        [...Array(Math.floor((to - from) / step) + 1)].map(
          (_, i) => from + i * step,
        );
      const arr = range(1, 300, 1);
      for await (const i of arr) {
        const params = await this.init(plugin.pluginspaceId);
        if (params[0].content.ableProdutcs == '0') {
          console.log(`\x1b[41m\x1b[37m CARGA DE PRODUTOS DESATIVADO \x1b[0m`);
          break;
        }
        const items = await this._load(plugin, token.value, i, payloadDto);
        if (items.length > 0) {
          console.log(
            'Produtos encontrados: ',
            items.length,
            '|',
            'Dias:',
            content.days,
          );
          let index = 1;
          for await (const item of items) {
            // Busca o produto
            const product = await this.productRepository.findByCode(
              item.productSKUId,
              pluginspaceId,
            );

            // Retorna o código da marca
            const mark = await this.markRepository.findByCode(
              item.brandId,
              pluginspaceId,
            );
            // Retorna a classificação
            const classification =
              await this.classificationRepository.findByCode(
                item.categoryId + '-' + item.sectionId,
                pluginspaceId,
              );

            const data = {
              pluginspaceId: pluginspaceId,
              userId: 341,
              name: item.name,
              description:
                item.description != '' ? item.description : item.name,
              technicalSpecification: item.technicalInformation,
              order: 0,
              status: true,
              code: item.productSKUId, //item.id,
              classificationId: classification.id,
            };
            if (mark) Object.assign(data, { markId: mark.id });

            if (product) {
              if (
                data.name != product.name ||
                data.code != product.code ||
                data.technicalSpecification != product.technicalSpecification ||
                data.description != product.description ||
                data.classificationId != product.classificationId
              ) {
                await this.productRepository.update(product.id, data);
                console.log(
                  index.toString().padStart(3, ' '),
                  `Produto \x1b[36m atualizado \x1b[0m`,
                  data.name.padEnd(50, ' '),
                  `${plugin.name} - ${plugin.pluginspaceId}`,
                );
              } else {
                console.log(
                  index.toString().padStart(3, ' '),
                  `Produto \x1b[42m\x1b[31m inalterado \x1b[0m`,
                  data.name.padEnd(50, ' '),
                  `${plugin.name} - ${plugin.pluginspaceId}`,
                );
              }
            } else {
              newProduct = await this.productRepository.create(data).save();
              console.log(
                index.toString().padStart(3, ' '),
                `Produto \x1b[32m criado \x1b[0m`,
                data.name.padEnd(50, ' '),
                `${plugin.name} - ${plugin.pluginspaceId}`,
              );
            }

            index++;

            await this.skuLocalVariationService.update(
              plugin,
              pluginspaceId,
              product ? product : newProduct,
              item,
            );
          }
        } else {
          console.log('Sem resultados');
          break;
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  async _load(
    plugin: any,
    token: string,
    page: any,
    payloadDto: PayloadDto,
  ): Promise<any> {
    const content = plugin.content;

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const axios = require('axios');
    const url = content.url + content.url_products;

    // const lastChange = moment()
    //   .subtract(content.days, 'days')
    //   .format('YYYY-MM-DDT00:10:00');

    const lastChange = moment(payloadDto.preDate).format('YYYY-MM-DDT00:01:00');

    const data = new URLSearchParams();
    data.append('branchId', content.branchId);
    data.append('isActive', 'true');
    data.append('lastChange', lastChange);
    data.append('page', page);
    data.append('pageSize', '300');
    const res = await axios({
      method: 'get',
      url: url,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Cookie: `suukie=${token}`,
      },
      params: data,
    }).catch(function (error) {
      console.log(error.toJSON());
    });
    return res.data.items;
  }
}
