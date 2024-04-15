import 'dotenv';
import { Injectable } from '@nestjs/common';
import { PluginconfigService } from 'src/pluginconfig/pluginconfig.service';
import { TokenService } from '../token/token.service';
import { MarkRepository } from './mark.repository';
import { Connection } from 'typeorm';
import * as moment from 'moment';
import { PayloadDto } from 'src/dtos/payload.dto';

@Injectable()
export class MarkService {
  private markRepository: MarkRepository;
  private logs: [];

  constructor(
    private readonly connection: Connection,
    private pluginconfigService: PluginconfigService,
    private tokenService: TokenService,
  ) {
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
    console.time('timer_m');
    console.log('Iniciando Marcas');
    console.log('Pluginspaces ', plugins.length);
    for await (const plugin of plugins) {
      try {
        const content = plugin.content;
        console.log('----------------------');
        console.log(
          ip,
          ' -',
          'Marcas de',
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
          content.ableBrands
            ? content.ableBrands == '1'
              ? `\x1b[34m Marcas Ativado \x1b[0m`
              : `\x1b[31m Marcas Desativado \x1b[0m`
            : `\x1b[31m Desativado \x1b[0m`,
          ']',
        );
        if (content.active == '1')
          if (content.ableBrands == '1') await this.update(plugin, payloadDto);
      } catch (error) {
        console.timeEnd('timer_m');
        console.log(error);
      }
    }
    console.timeEnd('timer_m');
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

      const content = plugin.content;

      const lastChange = moment(payloadDto.preDate).format(
        'YYYY-MM-DDT00:01:00',
      );

      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const axios = require('axios');
      const url = content.url + content.url_brands;
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
      console.log('Marcas encontrados: ', items.length);

      for await (const item of items) {
        const exists = await this.markRepository.findByCode(
          item.id,
          pluginspaceId,
        );
        const data = {
          pluginspaceId: pluginspaceId,
          userId: 341,
          plugintypeId: parseInt(process.env.PLUGINTYPE_ID),
          name: item.name,
          code: item.id,
          status: true,
        };

        if (exists) {
          if (data.name != exists.name || data.code != exists.code) {
            await this.markRepository.update(exists.id, data);
            console.log(
              `Marca \x1b[36m atualizada \x1b[0m`,
              data.name.padEnd(50, ' '),
              `${plugin.name} - ${plugin.pluginspaceId}`,
            );
          } else {
            console.log(
              `Marca \x1b[42m\x1b[31m inalterada \x1b[0m`,
              data.name.padEnd(50, ' '),
              `${plugin.name} - ${plugin.pluginspaceId}`,
            );
          }
        } else {
          await this.markRepository.create(data).save();
          console.log(
            `Marca \x1b[32m criada \x1b[0m`,
            data.name.padEnd(50, ' '),
            `${plugin.name} - ${plugin.pluginspaceId}`,
          );
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
}
