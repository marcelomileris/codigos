import { Orderstatus } from '../entities/Orderstatus.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Orderstatus)
export class OrderStatusRepository extends Repository<Orderstatus> {
  async findByOrderId(orderId: string, pluginspaceId: number): Promise<any> {
    return await this.findOne({
      where: {
        orderId: orderId,
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
