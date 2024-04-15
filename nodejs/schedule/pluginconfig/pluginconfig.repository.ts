import { EntityRepository, Repository } from 'typeorm';
import { Pluginconfig } from '../entities/Pluginconfig.entity';

@EntityRepository(Pluginconfig)
export class PluginconfigRepository extends Repository<Pluginconfig> {
  async getConfig(
    plugintemplateId: string,
    plugintypeId: string,
    pluginspaceId?: string | number,
  ) {
    try {
      const appconfig = this.createQueryBuilder('pluginConfig');
      appconfig
        .leftJoinAndSelect(
          'pluginSpace',
          'ps',
          'ps.id = pluginConfig.pluginspaceId',
        )
        // .innerJoinAndMapMany(
        //   'pluginConfig.pluginspace',
        //   Pluginspace,
        //   'pluginSpace',
        //   'pluginSpace.id = pluginConfig.pluginspaceId',
        // )
        .where('pluginConfig.plugintemplateId = :plugintemplateId', {
          plugintemplateId: plugintemplateId,
        })
        .andWhere('pluginConfig.plugintypeId = :plugintypeId', {
          plugintypeId: plugintypeId,
        })
        .select('pluginConfig.content', 'content')
        .addSelect('pluginConfig.pluginspaceId', 'pluginspaceId')
        .addSelect('ps.name', 'name')
        .orderBy('pluginConfig.id', 'DESC');

      if (pluginspaceId != undefined)
        appconfig.andWhere('pluginConfig.pluginspaceId = :pluginspaceId', {
          pluginspaceId: pluginspaceId,
        });

      // const res = await appconfig.getMany();

      const itemCount = await appconfig.getCount().then((resp) => {
        return resp;
      });
      const entities = await appconfig.getRawMany();

      return entities;
    } catch (error) {
      console.log(error);
    }
  }
}
