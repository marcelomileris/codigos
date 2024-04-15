import 'dotenv';
import { Injectable } from '@nestjs/common';
import { PluginconfigService } from 'src/pluginconfig/pluginconfig.service';
import { TokenService } from '../token/token.service';
import { ClassificationRepository } from './classification.repository';
import { Connection } from 'typeorm';
import * as moment from 'moment';
import * as fs from 'fs';
import { PayloadDto } from 'src/dtos/payload.dto';

@Injectable()
export class ClassificationService {
  private classificationRepository: ClassificationRepository;
  constructor(
    private readonly connection: Connection,
    private pluginconfigService: PluginconfigService,
    private tokenService: TokenService,
  ) {
    this.classificationRepository = this.connection.getCustomRepository(
      ClassificationRepository,
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
    console.time('timer_c');
    console.log('Iniciando Classificadores');
    console.log('Pluginspaces ', plugins.length);
    for await (const plugin of plugins) {
      try {
        const content = plugin.content;
        console.log('----------------------');
        console.log(
          ip,
          ' -',
          'Classificadores de',
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
          content.ableClassification
            ? content.ableClassification == '1'
              ? `\x1b[34m Classificador Ativado \x1b[0m`
              : `\x1b[31m Classificador Desativado \x1b[0m`
            : `\x1b[31m Desativado \x1b[0m`,
          ']',
        );
        if (content.active == '1')
          if (content.ableClassification == '1')
            await this.updateex(plugin, payloadDto);
      } catch (error) {
        console.timeEnd('timer_c');
        console.log(error);
      }
    }

    console.timeEnd('timer_c');
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
      const content = plugin.content;

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
        return;
      }

      // const lastChange = moment()
      //   .subtract(content.days, 'days')
      //   .format('YYYY-MM-DDT00:10:00');
      // const preDate = payloadDto.preDate;
      // const days = moment().diff(preDate, 'days');

      const lastChange = moment(payloadDto.preDate).format(
        'YYYY-MM-DDT00:01:00',
      );

      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const axios = require('axios');
      const url = content.url + content.url_classification;
      const pluginspaceId = plugin.pluginspaceId;
      const data = new URLSearchParams();
      data.append('pageSize', '2000');
      //data.append('pageSize', content.pageSize ?? '300');
      //data.append('lastChange', lastChange);
      const res = await axios({
        method: 'get',
        url: url,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          Cookie: `suukie=${token.value}`,
        },
        params: data,
      }).catch(function (error) {
        console.log(error.toJSON());
      });

      const items = res.data.items;
      console.log(
        'Classificadores encontrados: ',
        items.length,
        'Ordem:',
        level,
      );

      // Função que troca as letras iniciais em maiúscula
      const capitalize = (str) =>
        str.replace(
          /(^\w|\s\w)(\S*)/g,
          (_, m1, m2) => m1.toUpperCase() + m2.toLowerCase(),
        );

      // ['DSC', 'DS', 'DC', 'SC']
      const arr = [];
      items.map((item: any) => {
        if (level === 'DSC' && item.section && item.section.department) {
          arr.push({
            code: item.section.department.id + '',
            parent: null,
            name: item.section.department.name + '',
          });
          arr.push({
            code: item.section.department.id + '-' + item.section.id,
            parent: item.section.department.id + '',
            name: item.section.description,
          });
          arr.push({
            code:
              item.section.department.id +
              '-' +
              item.section.id +
              '-' +
              item.id,
            parent: item.section.department.id + '-' + item.section.id,
            name: item.name,
          });
        } else if (level === 'DS' && item.department) {
          arr.push({
            code: item.department.id + '',
            parent: null,
            name: item.department.name,
          });
          arr.push({
            code: item.department.id + '-' + item.id,
            parent: item.department.id + '',
            name: item.description,
          });
        } else if (level === 'DC'  && item.section && item.section.department) {
          arr.push({
            code: item.section.department.id + '',
            parent: null,
            name: item.section.department.name,
          });
          arr.push({
            code:
              item.section.department.id +
              '-' +
              item.section.id +
              '-' +
              item.id,
            parent: item.section.department.id + '',
            name: item.name,
          });
        } else if (level === 'SC' && item.section && item.section.department) {
          arr.push({
            code: item.section.department.id + '-' + item.section.id + '',
            parent: null,
            name: item.section.description,
          });
          arr.push({
            code:
              item.section.department.id +
              '-' +
              item.section.id +
              '-' +
              item.id,
            parent: item.section.department.id + '-' + item.section.id + '',
            name: item.name,
          });
        }
      });
      const classificators = arr.filter(
        (thing, index, self) =>
          index ===
          self.findIndex(
            (t) =>
              t.code === thing.code &&
              t.parent === thing.parent &&
              t.name === thing.name,
          ),
      );
      //console.log(items);
      //console.log(classificators);

      for await (const item of classificators) {
        const exists = await this.classificationRepository.findByCodeParent(
          item.code,
          item.parent,
          pluginspaceId,
        );
        const data = {
          pluginspaceId: pluginspaceId,
          userId: 341,
          plugintypeId: parseInt(process.env.PLUGINTYPE_ID),
          name: item.name ?? '',
          shortname: item.name,
          order: 0,
          code: item.code,
          parent: item.parent,
        };

        try {
          if (exists) {
            if (
              data.name != exists.name &&
              data.code != exists.code &&
              data.parent != exists.parent
            ) {
              await this.classificationRepository.update(exists.id, data);
              console.log(
                `Classificador \x1b[36m atualizado \x1b[0m`,
                '[',
                item.code,
                ']',
                data.name.padEnd(50, ' '),
                `${plugin.name} - ${plugin.pluginspaceId}`,
              );
            } else {
              console.log(
                `Classificador \x1b[42m\x1b[31m inalterado \x1b[0m`,
                '[',
                item.code,
                ']',
                data.name.padEnd(50, ' '),
                `${plugin.name} - ${plugin.pluginspaceId}`,
              );
            }
          } else {
            Object.assign(data, { img: 'public/default/no-image.png' }); // Adiciona a imagem com valor padrão
            await this.classificationRepository.create(data).save();
            console.log(
              `Classificador \x1b[32m criado \x1b[0m`,
              '[',
              item.code,
              ']',
              data.name.padEnd(50, ' '),
              `${plugin.name} - ${plugin.pluginspaceId}`,
            );
          }
        } catch (error) {
          console.log(error);
        }
      }

      // let N1 = items.map((row) => ({
      //   id: row.section.department.id,
      //   category: capitalize(row.section.department.name),
      //   section: row.section.description,
      //   department: row.name,
      //   codeCategory: row.section.department.id,
      //   codeSection: row.section.id,
      //   codeDepartment: row.id,
      // }));
      // N1 = N1.filter(
      //   (thing, index, self) =>
      //     index ===
      //     self.findIndex(
      //       (t) =>
      //         t.id === thing.id &&
      //         t.category === thing.category &&
      //         t.section === thing.section &&
      //         t.department === thing.department &&
      //         t.codeCategory === thing.codeCategory &&
      //         t.codeSection === thing.codeSection &&
      //         t.codeDepartment === thing.codeDepartment,
      //     ),
      // );
      //console.log(N1);

      // let N3 = items.map((row) => ({
      //   id: row.section.department.id,
      //   name: capitalize(row.section.department.name),
      // }));
      // N3 = N3.filter(
      //   (thing, index, self) =>
      //     index ===
      //     self.findIndex((t) => t.id === thing.id && t.name === thing.name),
      // );

      // let N2 = items.map((row) => ({
      //   id: row.section.id,
      //   name: capitalize(row.section.description),
      //   _id: row.section.id,
      // }));
      // N2 = N2.filter(
      //   (thing, index, self) =>
      //     index ===
      //     self.findIndex(
      //       (t) =>
      //         t.id === thing.id && t.name === thing.name && t._id === thing._id,
      //     ),
      // );

      // for await (const item of N0) {
      //   if (item.id != '0') {
      //     const exists = await this.classificationRepository.findByCodeParent(
      //       item.id,
      //       null,
      //       pluginspaceId,
      //     );
      //     const data = {
      //       pluginspaceId: pluginspaceId,
      //       userId: 341,
      //       plugintypeId: parseInt(process.env.PLUGINTYPE_ID),
      //       name: item.name,
      //       shortname: item.name,
      //       order: 0,
      //       code: item.id,
      //       parent: null,
      //     };

      //     try {
      //       if (exists) {
      //         if (
      //           data.name != exists.name &&
      //           data.shortname != exists.shortname &&
      //           data.code != exists.code
      //         ) {
      //           await this.classificationRepository.update(exists.id, data);
      //           console.log(
      //             `Classificador departamento \x1b[36m atualizado \x1b[0m`,
      //             '[',
      //             item.id,
      //             ']',
      //             data.name.padEnd(50, ' '),
      //             `${plugin.name} - ${plugin.pluginspaceId}`,
      //           );
      //         } else {
      //           console.log(
      //             `Classificador departamento \x1b[42m\x1b[31m inalterado \x1b[0m`,
      //             '[',
      //             item.id,
      //             ']',
      //             data.name.padEnd(50, ' '),
      //             `${plugin.name} - ${plugin.pluginspaceId}`,
      //           );
      //         }
      //       } else {
      //         Object.assign(data, { img: 'public/default/no-image.png' }); // Adiciona a imagem com valor padrão
      //         await this.classificationRepository.create(data).save();
      //         console.log(
      //           `Classificador departamento \x1b[32m criado \x1b[0m`,
      //           '[',
      //           item.id,
      //           ']',
      //           data.name.padEnd(50, ' '),
      //           `${plugin.name} - ${plugin.pluginspaceId}`,
      //         );
      //       }
      //     } catch (error) {
      //       console.log(error);
      //     }
      //   }
      // }

      // for await (const item of N1) {
      //   if (item._id != '0') {
      //     const codeSection = item.id + '-' + item._id;
      //     const exists = await this.classificationRepository.findByCodeParent(
      //       codeSection, //item.id,
      //       item._id,
      //       pluginspaceId,
      //     );
      //     const data = {
      //       pluginspaceId: pluginspaceId,
      //       userId: 341,
      //       plugintypeId: parseInt(process.env.PLUGINTYPE_ID),
      //       name: item.name,
      //       shortname: item.name,
      //       order: 0,
      //       code: codeSection,
      //       parent: item._id,
      //     };

      //     try {
      //       if (exists) {
      //         if (
      //           data.name != exists.name &&
      //           data.shortname != exists.shortname &&
      //           data.code != exists.code
      //         ) {
      //           await this.classificationRepository.update(exists.id, data);
      //           console.log(
      //             `Classificador setor \x1b[36m atualizado \x1b[0m`,
      //             '[',
      //             codeSection,
      //             '-',
      //             item._id,
      //             ']',
      //             data.name,
      //             `\t\t\t\t\t ${plugin.name} - ${plugin.pluginspaceId}`,
      //           );
      //         } else {
      //           console.log(
      //             `Classificador setor \x1b[42m\x1b[31m inalterado \x1b[0m`,
      //             '[',
      //             item.id,
      //             ']',
      //             data.name.padEnd(50, ' '),
      //             `${plugin.name} - ${plugin.pluginspaceId}`,
      //           );
      //         }
      //       } else {
      //         Object.assign(data, { img: 'public/default/no-image.png' }); // Adiciona a imagem com valor padrão
      //         await this.classificationRepository.create(data).save();
      //         console.log(
      //           `Classificador setor \x1b[32m criado \x1b[0m`,
      //           '[',
      //           codeSection,
      //           '-',
      //           item._id,
      //           ']',
      //           data.name.padEnd(50, ' '),
      //           `${plugin.name} - ${plugin.pluginspaceId}`,
      //         );
      //       }
      //     } catch (error) {
      //       console.log(error);
      //     }
      //   }
      // }

      // for await (const item of N2) {
      //   if (item._id != '0') {
      //     const codeCategory = item.id + '-' + item._id;
      //     const codeParent = item._id + '-' + item.codeDepartment;
      //     const exists = await this.classificationRepository.findByCodeParent(
      //       codeCategory,
      //       codeParent, //item._id,
      //       pluginspaceId,
      //     );
      //     const data = {
      //       pluginspaceId: pluginspaceId,
      //       userId: 341,
      //       plugintypeId: parseInt(process.env.PLUGINTYPE_ID),
      //       name: item.name,
      //       shortname: item.name,
      //       order: 0,
      //       code: codeCategory, //item.id,
      //       parent: codeParent, //item._id,
      //     };

      //     try {
      //       if (exists) {
      //         if (
      //           data.name != exists.name ||
      //           data.shortname != exists.shortname ||
      //           data.code != exists.code
      //         ) {
      //           await this.classificationRepository.update(exists.id, data);
      //           console.log(
      //             `Classificador categoria \x1b[36m atualizado \x1b[0m`,
      //             '[',
      //             codeCategory,
      //             '-',
      //             codeParent,
      //             ']',
      //             data.name.padEnd(50, ' '),
      //             `${plugin.name} - ${plugin.pluginspaceId}`,
      //           );
      //         } else {
      //           console.log(
      //             `Classificador categoria \x1b[42m\x1b[31m inalterado \x1b[0m`,
      //             '[',
      //             item.id,
      //             ']',
      //             data.name.padEnd(50, ' '),
      //             `${plugin.name} - ${plugin.pluginspaceId}`,
      //           );
      //         }
      //       } else {
      //         Object.assign(data, { img: 'public/default/no-image.png' }); // Adiciona a imagem com valor padrão
      //         await this.classificationRepository.create(data).save();
      //         console.log(
      //           `Classificador categoria \x1b[32m criado \x1b[0m`,
      //           '[',
      //           codeCategory,
      //           '-',
      //           codeParent,
      //           ']',
      //           data.name,
      //           `\t\t\t\t\t ${plugin.name} - ${plugin.pluginspaceId}`,
      //         );
      //       }
      //     } catch (error) {
      //       console.log(error);
      //     }
      //   }
      // }
    } catch (error) {
      console.log(error);
    }
  }

  async update(plugin: any, payloadDto: PayloadDto): Promise<any> {
    try {
      const token = await this.tokenService.token(plugin);
      if (token.success == false) return;
      const content = plugin.content;

      // const lastChange = moment()
      //   .subtract(content.days, 'days')
      //   .format('YYYY-MM-DDT00:10:00');
      // const preDate = payloadDto.preDate;
      // const days = moment().diff(preDate, 'days');

      const lastChange = moment(payloadDto.preDate).format(
        'YYYY-MM-DDT00:01:00',
      );

      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const axios = require('axios');
      const url = content.url + content.url_classification;
      const pluginspaceId = plugin.pluginspaceId;
      const data = new URLSearchParams();
      data.append('pageSize', '2000');
      //data.append('pageSize', content.pageSize ?? '300');
      //data.append('lastChange', lastChange);
      const res = await axios({
        method: 'get',
        url: url,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          Cookie: `suukie=${token.value}`,
        },
        params: data,
      }).catch(function (error) {
        console.log(error.toJSON());
      });

      const items = res.data.items;
      console.log('Classificadores encontrados: ', items.length);

      // Função que troca as letras iniciais em maiúscula
      const capitalize = (str) =>
        str.replace(
          /(^\w|\s\w)(\S*)/g,
          (_, m1, m2) => m1.toUpperCase() + m2.toLowerCase(),
        );

      const order = 'CSD';

      let N0 = items.map((row) => ({
        id: row.section.department.id,
        name: capitalize(row.section.department.name),
      }));
      N0 = N0.filter(
        (thing, index, self) =>
          index ===
          self.findIndex((t) => t.id === thing.id && t.name === thing.name),
      );

      let N1 = items.map((row) => ({
        id: row.section.id,
        name: capitalize(row.section.description),
        _id: row.section.department.id,
      }));
      N1 = N1.filter(
        (thing, index, self) =>
          index ===
          self.findIndex(
            (t) =>
              t.id === thing.id && t.name === thing.name && t._id === thing._id,
          ),
      );

      let N2 = items.map((row) => ({
        id: row.id,
        name: capitalize(row.name),
        _id: row.section.id,
        codeDepartment: row.section.department.id,
      }));
      N2 = N2.filter(
        (thing, index, self) =>
          index ===
          self.findIndex(
            (t) =>
              t.id === thing.id &&
              t.name === thing.name &&
              t._id === thing._id &&
              t.codeDepartment === thing.codeDepartment,
          ),
      );

      for await (const item of N0) {
        if (item.id != '0') {
          const exists = await this.classificationRepository.findByCodeParent(
            item.id,
            null,
            pluginspaceId,
          );
          const data = {
            pluginspaceId: pluginspaceId,
            userId: 341,
            plugintypeId: parseInt(process.env.PLUGINTYPE_ID),
            name: item.name,
            shortname: item.name,
            order: 0,
            code: item.id,
            parent: null,
          };

          try {
            if (exists) {
              if (
                data.name != exists.name &&
                data.shortname != exists.shortname &&
                data.code != exists.code
              ) {
                await this.classificationRepository.update(exists.id, data);
                console.log(
                  `Classificador departamento \x1b[36m atualizado \x1b[0m`,
                  '[',
                  item.id,
                  ']',
                  data.name.padEnd(50, ' '),
                  `${plugin.name} - ${plugin.pluginspaceId}`,
                );
              } else {
                console.log(
                  `Classificador departamento \x1b[42m\x1b[31m inalterado \x1b[0m`,
                  '[',
                  item.id,
                  ']',
                  data.name.padEnd(50, ' '),
                  `${plugin.name} - ${plugin.pluginspaceId}`,
                );
              }
            } else {
              Object.assign(data, { img: 'public/default/no-image.png' }); // Adiciona a imagem com valor padrão
              await this.classificationRepository.create(data).save();
              console.log(
                `Classificador departamento \x1b[32m criado \x1b[0m`,
                '[',
                item.id,
                ']',
                data.name.padEnd(50, ' '),
                `${plugin.name} - ${plugin.pluginspaceId}`,
              );
            }
          } catch (error) {
            console.log(error);
          }
        }
      }

      for await (const item of N1) {
        if (item._id != '0') {
          const codeSection = item.id + '-' + item._id;
          const exists = await this.classificationRepository.findByCodeParent(
            codeSection, //item.id,
            item._id,
            pluginspaceId,
          );
          const data = {
            pluginspaceId: pluginspaceId,
            userId: 341,
            plugintypeId: parseInt(process.env.PLUGINTYPE_ID),
            name: item.name,
            shortname: item.name,
            order: 0,
            code: codeSection,
            parent: item._id,
          };

          try {
            if (exists) {
              if (
                data.name != exists.name &&
                data.shortname != exists.shortname &&
                data.code != exists.code
              ) {
                await this.classificationRepository.update(exists.id, data);
                console.log(
                  `Classificador setor \x1b[36m atualizado \x1b[0m`,
                  '[',
                  codeSection,
                  '-',
                  item._id,
                  ']',
                  data.name,
                  `\t\t\t\t\t ${plugin.name} - ${plugin.pluginspaceId}`,
                );
              } else {
                console.log(
                  `Classificador setor \x1b[42m\x1b[31m inalterado \x1b[0m`,
                  '[',
                  item.id,
                  ']',
                  data.name.padEnd(50, ' '),
                  `${plugin.name} - ${plugin.pluginspaceId}`,
                );
              }
            } else {
              Object.assign(data, { img: 'public/default/no-image.png' }); // Adiciona a imagem com valor padrão
              await this.classificationRepository.create(data).save();
              console.log(
                `Classificador setor \x1b[32m criado \x1b[0m`,
                '[',
                codeSection,
                '-',
                item._id,
                ']',
                data.name.padEnd(50, ' '),
                `${plugin.name} - ${plugin.pluginspaceId}`,
              );
            }
          } catch (error) {
            console.log(error);
          }
        }
      }

      for await (const item of N2) {
        if (item._id != '0') {
          const codeCategory = item.id + '-' + item._id;
          const codeParent = item._id + '-' + item.codeDepartment;
          const exists = await this.classificationRepository.findByCodeParent(
            codeCategory,
            codeParent, //item._id,
            pluginspaceId,
          );
          const data = {
            pluginspaceId: pluginspaceId,
            userId: 341,
            plugintypeId: parseInt(process.env.PLUGINTYPE_ID),
            name: item.name,
            shortname: item.name,
            order: 0,
            code: codeCategory, //item.id,
            parent: codeParent, //item._id,
          };

          try {
            if (exists) {
              if (
                data.name != exists.name ||
                data.shortname != exists.shortname ||
                data.code != exists.code
              ) {
                await this.classificationRepository.update(exists.id, data);
                console.log(
                  `Classificador categoria \x1b[36m atualizado \x1b[0m`,
                  '[',
                  codeCategory,
                  '-',
                  codeParent,
                  ']',
                  data.name.padEnd(50, ' '),
                  `${plugin.name} - ${plugin.pluginspaceId}`,
                );
              } else {
                console.log(
                  `Classificador categoria \x1b[42m\x1b[31m inalterado \x1b[0m`,
                  '[',
                  item.id,
                  ']',
                  data.name.padEnd(50, ' '),
                  `${plugin.name} - ${plugin.pluginspaceId}`,
                );
              }
            } else {
              Object.assign(data, { img: 'public/default/no-image.png' }); // Adiciona a imagem com valor padrão
              await this.classificationRepository.create(data).save();
              console.log(
                `Classificador categoria \x1b[32m criado \x1b[0m`,
                '[',
                codeCategory,
                '-',
                codeParent,
                ']',
                data.name,
                `\t\t\t\t\t ${plugin.name} - ${plugin.pluginspaceId}`,
              );
            }
          } catch (error) {
            console.log(error);
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  async updateFather(plugin: any): Promise<any> {
    try {
      const token = await this.tokenService.token(plugin);
      const content = plugin.content;

      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const axios = require('axios');
      const url = content.url + content.url_departaments;
      const pluginspaceId = plugin.pluginspaceId;
      const data = new URLSearchParams();
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

      const items = res.data.items;
      console.log('Classificadores encontrados: ', items.length);

      for await (const item of items) {
        const exists = await this.classificationRepository.findByCode(
          item.id,
          pluginspaceId,
        );
        const data = {
          pluginspaceId: pluginspaceId,
          userId: 341,
          plugintypeId: parseInt(process.env.PLUGINTYPE_ID),
          name: item.name,
          shortname: item.name,
          order: 0,
          code: item.id,
          parent: '',
        };

        try {
          if (exists) {
            await this.classificationRepository.update(exists.id, data);
            console.log(
              `Classificador \x1b[36m atualizado \x1b[0m`,
              '[',
              item.id,
              ']',
              data.name,
              `:\t\t ${plugin.name} - ${plugin.pluginspaceId}`,
            );
          } else {
            Object.assign(data, { img: 'public/default/no-image.png' }); // Adiciona a imagem com valor padrão
            await this.classificationRepository.create(data).save();
            console.log(
              `Classificador \x1b[32m criado \x1b[0m`,
              '[',
              item.id,
              ']',
              data.name,
              `:\t\t ${plugin.name} - ${plugin.pluginspaceId}`,
            );
          }
        } catch (error) {
          console.log(error);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  async updateParent(plugin: any): Promise<any> {
    try {
      const token = await this.tokenService.token(plugin);
      const content = plugin.content;

      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const axios = require('axios');
      const url = content.url + content.url_sections;
      const pluginspaceId = plugin.pluginspaceId;
      const data = new URLSearchParams();
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

      const items = res.data.items;
      console.log('Classificadores encontrados: ', items.length);

      for await (const item of items) {
        const exists = await this.classificationRepository.findByCodeParent(
          item.department.id,
          item.id,
          pluginspaceId,
        );
        const data = {
          pluginspaceId: pluginspaceId,
          userId: 341,
          plugintypeId: parseInt(process.env.PLUGINTYPE_ID),
          name: item.description,
          shortname: item.description,
          order: 0,
          code: item.id,
          parent: item.department.id,
        };

        try {
          if (exists) {
            await this.classificationRepository.update(exists.id, data);
            console.log(
              `Classificador \x1b[36m atualizado \x1b[0m`,
              data.name,
              `:\t\t ${plugin.name} - ${plugin.pluginspaceId}`,
            );
          } else {
            Object.assign(data, { img: 'public/default/no-image.png' }); // Adiciona a imagem com valor padrão
            await this.classificationRepository.create(data).save();
            console.log(
              `Classificador \x1b[32m criado \x1b[0m`,
              data.name,
              `:\t\t ${plugin.name} - ${plugin.pluginspaceId}`,
            );
          }
        } catch (error) {
          console.log(error);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
}
