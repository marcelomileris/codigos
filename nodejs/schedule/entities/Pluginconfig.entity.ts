import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { LocationPluginconfig } from './LocationPluginconfig.entity';
import { Plugintemplate } from './Plugintemplate.entity';
import { Plugintype } from './Plugintype.entity';

@Index('pk_pluginconfig', ['id'], { unique: true })
@Index('FK_pluginconfig_pluginspace1_idx', ['pluginspaceId'], {})
@Index('FK_pluginconfig_plugintemplate1_idx', ['plugintemplateId'], {})
@Index('FK_pluginconfig_plugintype1_idx', ['plugintypeId'], {})
@Entity('pluginConfig', { schema: 'public' })
export class Pluginconfig {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('integer', { name: 'pluginspaceId' })
  pluginspaceId: number;

  @Column('integer', { name: 'plugintypeId' })
  plugintypeId: number;

  @Column('integer', { name: 'plugintemplateId' })
  plugintemplateId: number;

  @Column('varchar', { name: 'name', nullable: true, length: 120 })
  name: string | null;

  @Column('json', { name: 'content', default: {} })
  content: object;

  @Column('timestamp', {
    name: 'created',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  created: Date | null;

  @Column('timestamp', {
    name: 'updated',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  updated: Date | null;

  @Column('timestamp', { name: 'deleted', nullable: true })
  deleted: Date | null;

  @OneToMany(
    () => LocationPluginconfig,
    (locationPluginconfig) => locationPluginconfig.pluginconfig,
  )
  locationPluginconfigs: LocationPluginconfig[];

  @ManyToOne(
    () => Plugintemplate,
    (plugintemplate) => plugintemplate.pluginconfigs,
  )
  @JoinColumn([{ name: 'plugintemplateId', referencedColumnName: 'id' }])
  plugintemplate: Plugintemplate;

  @ManyToOne(() => Plugintype, (plugintype) => plugintype.pluginconfigs)
  @JoinColumn([{ name: 'plugintypeId', referencedColumnName: 'id' }])
  plugintype: Plugintype;
}
