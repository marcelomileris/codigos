import { Classification } from '../entities/Classification.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Classification)
export class ClassificationRepository extends Repository<Classification> {
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

  async findByCodeParent(
    code: string,
    parent: string | null,
    pluginspaceId: number,
  ): Promise<any> {
    return await this.findOne({
      where: {
        code: code,
        parent: parent,
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

  async findById(id: string, pluginspaceId: number): Promise<any> {
    return await this.findOne({
      where: {
        id: id,
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
