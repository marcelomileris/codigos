import { Location } from '../entities/Location.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Location)
export class LocationRepository extends Repository<LocationRepository> {
  async findByCode(code: string, pluginspaceId: number): Promise<any> {
    return await this.findOne({
      where: {
        code: code,
        pluginspaceId: pluginspaceId,
        type: 'internal',
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
        type: 'internal',
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
