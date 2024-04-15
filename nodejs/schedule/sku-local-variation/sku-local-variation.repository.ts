import { SkuLocalVariation } from 'src/entities/SkuLocalVariation.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(SkuLocalVariation)
export class SkuLocalVariationRepository extends Repository<SkuLocalVariation> {
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

  async findByProductId(
    productId: string,
    pluginspaceId: number,
  ): Promise<any> {
    return await this.findOne({
      where: {
        productId: productId,
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

  async findByProductIdLocation(
    productId: string,
    pluginspaceId: number,
    locationId: number,
  ): Promise<any> {
    return await this.findOne({
      where: {
        productId: productId,
        pluginspaceId: pluginspaceId,
        locationId: locationId,
      },
    })
      .then((response) => {
        return response !== undefined ? response : false;
      })
      .catch((error) => {
        return error;
      });
  }

  async findBySKU(SKU: string, pluginspaceId: number): Promise<any> {
    return await this.findOne({
      where: {
        sku: SKU,
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
