import { Status } from '../entities/Status.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Status)
export class StatusRepository extends Repository<Status> {
  async getStatusPluginSpaceBySlugOne(slug: string, pluginspaceId: number) {
    try {
      const status = await this.createQueryBuilder('status')
        .select('status')
        .where('status.pluginspaceId = :pluginspaceId', {
          pluginspaceId: pluginspaceId,
        })
        .andWhere('status.slug = :slug', { slug: slug })
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
}
