import 'dotenv';
import { Injectable } from '@nestjs/common';
import { PluginconfigService } from 'src/pluginconfig/pluginconfig.service';
import { TokenService } from '../token/token.service';
import { OrderRepository } from './order.repository';
import { Connection } from 'typeorm';
import { OrderStatusRepository } from 'src/orderstatus/orderstatus.repository';
import { StatusRepository } from 'src/status/status.repository';
import * as moment from 'moment';

@Injectable()
export class OrderService {
  private orderRepository: OrderRepository;
  private orderStatusRepository: OrderStatusRepository;
  private statusRepository: StatusRepository;
  constructor(
    private readonly connection: Connection,
    private pluginconfigService: PluginconfigService,
    private tokenService: TokenService,
  ) {
    this.orderRepository = this.connection.getCustomRepository(OrderRepository);
    this.orderStatusRepository = this.connection.getCustomRepository(
      OrderStatusRepository,
    );
    this.statusRepository =
      this.connection.getCustomRepository(StatusRepository);
  }

  async init(pluginspaceId?: string): Promise<any> {
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

  async do(pluginspaceId?: string): Promise<any> {
    const plugins = await this.init(pluginspaceId);
    console.time('timer_order');
    console.log('Iniciando Pedidos');
    console.log('Pluginspaces ', plugins.length);
    for await (const plugin of plugins) {
      try {
        const content = plugin.content;
        console.log('----------------------');
        console.log(
          'Pedidos de',
          '\x1b[43m',
          '\x1b[31m',
          plugin.name,
          '\x1b[0m',
          plugin.pluginspaceId,
          '[',
          content.active
            ? content.active == '1'
              ? `\x1b[34m Ativado \x1b[0m`
              : `\x1b[31m Desativado \x1b[0m`
            : `\x1b[31m Desativado \x1b[0m`,
          ']',
        );
        if (content.active == '1') await this.update(plugin);
      } catch (error) {
        console.log(error);
      }
    }
    console.timeEnd('timer_order');
    console.log('\x1b[47m fim \x1b[0m');
    console.log('----------------------');
    return {
      Dados: plugins,
      message: 'OK',
      success: true,
    };
  }

  async update(plugin: any): Promise<any> {
    try {
      const token = await this.tokenService.token(plugin);
      if (token.success == false) return;
      const pluginspaceId = plugin.pluginspaceId;
      let newProduct;

      // Cria um array com o range especificado (de 1 até 1000)
      const range = (from, to, step) =>
        [...Array(Math.floor((to - from) / step) + 1)].map(
          (_, i) => from + i * step,
        );
      const arr = range(1, 100, 1);
      for await (const i of arr) {
        const items = await this._load(plugin, token.value, i);
        if (items.length > 0) {
          console.log('Pedidos encontrados: ', items.length);

          const status = [];
          const statusID = [];
          const statusReady =
            await this.statusRepository.getStatusPluginSpaceBySlugOne(
              'ready',
              pluginspaceId,
            );
          status.push(statusReady ?? []);
          statusID.push(statusReady?.id ?? 0);
          const statusBilling =
            await this.statusRepository.getStatusPluginSpaceBySlugOne(
              'billing',
              pluginspaceId,
            );
          status.push(statusBilling ?? []);
          statusID.push(statusBilling?.id ?? 0);

          const statusRefused =
            await this.statusRepository.getStatusPluginSpaceBySlugOne(
              'refused',
              pluginspaceId,
            );
          status.push(statusRefused ?? []);
          statusID.push(statusRefused?.id ?? 0);

          const statusSeparating =
            await this.statusRepository.getStatusPluginSpaceBySlugOne(
              'separating',
              pluginspaceId,
            );
          status.push(statusSeparating ?? []);
          statusID.push(statusSeparating?.id ?? 0);

          for await (const item of items) {
            /* **
            B -> BLOQUEADO  -> [open]
            L -> LIBERADO   -> [ready]
            M -> MONTADO    -> [separating]
            F -> FATURADO   -> [billing]
            C -> CANCELADO  -> [refused]
            ** */

            const order = await this.orderRepository.getOrderByOrderIdExt(
              item.orderId,
              pluginspaceId,
            );
            if (order !== undefined) {
              let filteredStatus;

              if (item.orderStatus == 'B') {
                if (!statusID.includes(order?.status_id)) {
                  // Criar status e atualizar order
                  filteredStatus = status.filter(
                    (item) => item.slug.indexOf('open') > -1,
                  );
                }
              }

              if (item.orderStatus == 'L') {
                if (!statusID.includes(order?.statusId)) {
                  // Criar status e atualizar order (READY)
                  filteredStatus = status.filter(
                    (item) => item.slug.indexOf('ready') > -1,
                  );
                }
              }

              if (item.orderStatus == 'M') {
                if (!statusID.includes(order?.status_id)) {
                  // Criar status e atualizar order
                  filteredStatus = status.filter(
                    (item) => item.slug.indexOf('separating') > -1,
                  );
                }
              }

              if (item.orderStatus == 'F') {
                if (!statusID.includes(order?.status_id)) {
                  // Criar status e atualizar order
                  filteredStatus = status.filter(
                    (item) => item.slug.indexOf('billing') > -1,
                  );
                }
              }

              if (item.orderStatus == 'C') {
                if (!statusID.includes(order?.status_id)) {
                  // Criar status e atualizar order
                  filteredStatus = status.filter(
                    (item) => item.slug.indexOf('refused') > -1,
                  );
                }
              }

              if (filteredStatus != undefined) {
                if (order.statusId !== filteredStatus[0].id) {
                  order.statusId = filteredStatus[0].id;
                  await this.orderRepository.update(order.id, order);
                  const orderStatus = {
                    created: new Date(),
                    status: filteredStatus[0].id,
                    orderId: order.id,
                    statusId: filteredStatus[0].id,
                    userId: 341,
                    orderidExt: item.orderId,
                  };
                  await this.orderStatusRepository.create(orderStatus).save();
                  console.log(
                    `Pedido \x1b[36m atualizado \x1b[0m`,
                    order?.id ?? '-',
                    item.orderId,
                    item.orderStatus,
                    order?.statusId ?? '-',
                  );
                } else {
                  console.log(
                    `Pedido \x1b[36m não atualizado \x1b[0m`,
                    order?.id ?? '-',
                    item.orderId,
                    item.orderStatus,
                    order?.statusId ?? '-',
                  );
                }
              } else {
                console.log(
                  `Pedido \x1b[36m não atualizado \x1b[0m`,
                  order?.id ?? '-',
                  item.orderId,
                  item.orderStatus,
                  order?.statusId ?? '-',
                );
              }
            } else {
              console.log(
                'Pedido',
                `\x1b[32m ${item.orderId} \x1b[0m`,
                'não encontrado',
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

  async _load(plugin: any, token: string, page: any): Promise<any> {
    const content = plugin.content;

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const axios = require('axios');
    const url = content.url + content.url_orders;

    const lastChange = moment()
      .subtract(content.days, 'days')
      .format('YYYY-MM-DDT00:10:00');

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
