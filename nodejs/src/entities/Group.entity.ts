import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Pluginspace } from './Pluginspace.entity';

@Index('pk_group', ['id'], { unique: true })
@Index('FK_group_pluginspace1_idx', ['pluginspaceId'], {})
@Entity('group', { schema: 'public' })
export class Group {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('integer', { name: 'pluginspaceId' })
  pluginspaceId: number;

  @Column('varchar', { name: 'name', nullable: true, length: 250 })
  name: string | null;

  @Column('timestamp', {
    name: 'created',
    nullable: true,
    default: () => 'now()',
  })
  created: Date | null;

  @Column('timestamp', {
    name: 'updated',
    nullable: true,
    default: () => 'now()',
  })
  updated: Date | null;

  @ManyToOne(() => Pluginspace, (pluginspace) => pluginspace.groups)
  @JoinColumn([{ name: 'pluginspaceId', referencedColumnName: 'id' }])
  pluginspace: Pluginspace;
}
