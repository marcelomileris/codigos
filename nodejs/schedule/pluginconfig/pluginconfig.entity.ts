import {
  BaseEntity,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Pluginspace } from './pluginspace.entity';

@Index('FK_pluginconfig_pluginspace1_idx', ['pluginspaceId'], {})
@Index('FK_pluginconfig_plugintype1_idx', ['plugintypeId'], {})
@Index('FK_pluginconfig_plugintemplate1_idx', ['plugintemplateId'], {})
@Entity('pluginconfig', { schema: 'ninegrid' })
export class Pluginconfig extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'pluginspace_id' })
  pluginspaceId: number;

  @Column('int', { name: 'plugintype_id' })
  plugintypeId: number;

  @Column('int', { name: 'plugintemplate_id' })
  plugintemplateId: number;

  @Column('varchar', {
    name: 'name',
    nullable: true,
    length: 120,
    default: () => "'Pluginconfig'",
  })
  name: string | null;

  @Column('text', { name: 'content', nullable: true })
  content: string | null;

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

  @ManyToOne(() => Pluginspace, (pluginspace) => pluginspace.pluginconfigIds)
  @JoinColumn([{ name: 'pluginspace_id', referencedColumnName: 'id' }])
  pluginspace: Pluginspace;
}
