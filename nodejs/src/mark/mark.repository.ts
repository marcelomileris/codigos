import { Mark } from '../entities/Mark.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Mark)
export class MarkRepository extends Repository<Mark> {
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
