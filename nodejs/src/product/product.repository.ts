import { Product } from '../entities/Product.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Product)
export class ProductRepository extends Repository<Product> {
  async findByCode(code: string, pluginspaceId: number): Promise<any> {
    return await this.findOne({
      where: {
        code: code,
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
