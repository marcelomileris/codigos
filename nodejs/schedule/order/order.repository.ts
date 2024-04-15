import { Order } from '../entities/Order.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Order)
export class OrderRepository extends Repository<Order> {
  async getOrderByOrderIdExt(orderIdExt: string, pluginspaceId: number) {
    try {
      const status = await this.createQueryBuilder('order')
        .select('order')
        .where('order.pluginspaceId = :pluginspaceId', {
          pluginspaceId: pluginspaceId,
        })
        .andWhere(
          `(content->'dataGateway'->'orderIdExt')::text = '"${orderIdExt}"'`,
        )
        .getOne()
        .then((resp) => {
          return resp;
        })
        .catch((error) => {
          return error;
        });
      return status;
    } catch (error) {
      return error;
    }
  }

  async findAll(pluginspaceId: number): Promise<any> {
    return await this.find({
      where: {
        pluginspaceId: pluginspaceId,
      },
    })
      .then((response) => {
        return response !== undefined ? response : false;
      })
      .catch((error) => {
        return error;
      });
  }
}
