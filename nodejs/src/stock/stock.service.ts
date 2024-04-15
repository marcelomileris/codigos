import 'dotenv';
import { Injectable } from '@nestjs/common';
import { PluginconfigService } from 'src/pluginconfig/pluginconfig.service';
import { TokenService } from '../token/token.service';
import { ProductRepository } from 'src/product/product.repository';
import { Connection, getConnection } from 'typeorm';
import { SkuLocalVariationService } from 'src/sku-local-variation/sku-local-variation.service';
import { SkuLocalVariationRepository } from 'src/sku-local-variation/sku-local-variation.repository';
import { SkuLocalVariation } from 'src/entities/SkuLocalVariation.entity';
import * as moment from 'moment';
import { PayloadDto } from 'src/dtos/payload.dto';

@Injectable()
export class StockService {
  private productRepository: ProductRepository;
  private skuLocalVariationRepository: SkuLocalVariationRepository;
  constructor(
    private readonly connection: Connection,
    private pluginconfigService: PluginconfigService,
    private tokenService: TokenService,
    private skuLocalVariationService: SkuLocalVariationService,
  ) {
    this.productRepository =
      this.connection.getCustomRepository(ProductRepository);
    this.skuLocalVariationRepository = this.connection.getCustomRepository(
      SkuLocalVariationRepository,
    );
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
    console.time('timer_stock');
    console.log('Iniciando Estoque');
    console.log('Pluginspaces ', plugins.length);
    for await (const plugin of plugins) {
      try {
        const content = plugin.content;
        console.log('----------------------');
        console.log(
          'Estoque de',
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
          content.ablePrice
            ? content.ablePrice == '1'
              ? `\x1b[34m Classificador Ativado \x1b[0m`
              : `\x1b[31m Classificador Desativado \x1b[0m`
            : `\x1b[31m Desativado \x1b[0m`,
          ']',
        );
        if (content.active == '1')
          if (content.ableStock == '1') await this.update(plugin, payloadDto);
      } catch (error) {
        console.timeEnd('timer_stock');
        console.log(error);
      }
    }
    console.timeEnd('timer_stock');
    console.log('\x1b[47m fim \x1b[0m');
    console.log('----------------------');
    return {
      Dados: plugins,
      message: 'OK',
      success: true,
    };
  }

  async update(plugin: any, payloadDto: PayloadDto): Promise<any> {
    try {
      const token = await this.tokenService.token(plugin);
      if (token.success == false) return;
      const pluginspaceId = plugin.pluginspaceId;

      // Cria um array com o range especificado (de 1 até 1000)
      const range = (from, to, step) =>
        [...Array(Math.floor((to - from) / step) + 1)].map(
          (_, i) => from + i * step,
        );
      const arr = range(1, 300, 1);
      for await (const i of arr) {
        const params = await this.init(plugin.pluginspaceId);
        if (params[0].content.active == '0') {
          console.log(`\x1b[41m\x1b[37m CARGA DE ESTOQUE DESATIVADO \x1b[0m`);
          break;
        }
        const items = await this._load(plugin, token.value, i, payloadDto);
        if (items.length > 0) {
          if (items.productSKUId == '7896301408699-17') {
            const achou = '1';
          }
          console.log('Produtos encontrados: ', items.length);
          for await (const item of items) {
            // Busca o produto
            const stock = await this.skuLocalVariationRepository.findBySKU(
              item.productId,
              pluginspaceId,
            );

            const product = await this.productRepository.findOne({
              where: {
                pluginspaceId: pluginspaceId,
                id: stock.productId,
              },
            });

            if (stock) {
              if (stock.inventory != item.quantity) {
                // Atualiza o preço do produto
                await getConnection()
                  .createQueryBuilder()
                  .update(SkuLocalVariation)
                  .set({
                    inventory: item.quantity,
                  })
                  .where('productId = :productId', {
                    productId: stock.productId,
                  })
                  .andWhere('pluginspaceId = :pluginspaceId', {
                    pluginspaceId: pluginspaceId,
                  })
                  .execute();
                console.log(
                  `Estoque \x1b[36m atualizado \x1b[0m`,
                  item.quantity,
                  product.name,
                );
              } else {
                console.log(
                  `Estoque \x1b[42m\x1b[31m inalterado \x1b[0m`,
                  product.name.padEnd(50, ' '),
                  item.quantity,
                  `${plugin.name} - ${plugin.pluginspaceId}`,
                );
              }
            } else {
              console.log(
                `Produto \x1b[32m ${
                  product?.name ?? item.productId
                } \x1b[0m não encontrado`,
              );
            }
          }
        } else {
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
    const url = content.url + content.url_stock;

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
