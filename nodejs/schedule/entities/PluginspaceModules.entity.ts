import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Pluginspace } from './Pluginspace.entity';

@Index('pluginspace_module_PK', ['id'], { unique: true })
@Index('pluginspace_module_UNIQUE', ['modules', 'type'], { unique: true })
@Entity('pluginspace_modules', { schema: 'public' })
export class PluginspaceModules {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('varchar', { name: 'modules', unique: true, length: 120 })
  modules: string;

  @Column('enum', {
    name: 'type',
    enum: [
      'hospitality',
      'healthcare',
      'retail',
      'group',
      'totvs',
      'varejo',
      'fashion',
    ],
  })
  type:
    | 'hospitality'
    | 'healthcare'
    | 'retail'
    | 'group'
    | 'totvs'
    | 'varejo'
    | 'fashion';

  @Column('timestamp', {
    name: 'created',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created: Date;

  @Column('timestamp', {
    name: 'updated',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updated: Date;

  @Column('timestamp', { name: 'deleted', nullable: true })
  deleted: Date | null;

  @ManyToOne(() => Pluginspace, (pluginspace) => pluginspace.pluginspaceModules)
  @JoinColumn([{ name: 'pluginspaceId', referencedColumnName: 'id' }])
  pluginspace: Pluginspace;
}
