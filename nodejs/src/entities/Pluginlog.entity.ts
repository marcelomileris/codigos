import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Pluginspace } from './Pluginspace.entity';
import { Plugintype } from './Plugintype.entity';
import { Status } from './Status.entity';

@Index('pk_pluginlog', ['id'], { unique: true })
@Index('FK_pluginlog_pluginspace1_idx', ['pluginspaceId'], {})
@Index('FK_pluginlog_plugintype1_idx', ['plugintypeId'], {})
@Index('FK_pluginlog_status1_idx', ['statusId'], {})
@Entity('pluginlog', { schema: 'public' })
export class Pluginlog {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('integer', { name: 'pluginspace_id' })
  pluginspaceId: number;

  @Column('integer', { name: 'plugintype_id' })
  plugintypeId: number;

  @Column('text', { name: 'event', nullable: true })
  event: string | null;

  @Column('integer', { name: 'status', nullable: true, default: () => '0' })
  status: number | null;

  @Column('varchar', {
    name: 'sender_id',
    nullable: true,
    length: 50,
  })
  senderId: string | null;

  @Column('text', { name: 'content', nullable: true })
  content: string | null;

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

  @Column('integer', { name: 'status_id', nullable: true })
  statusId: number | null;

  @ManyToOne(() => Pluginspace, (pluginspace) => pluginspace.pluginlogs)
  @JoinColumn([{ name: 'pluginspace_id', referencedColumnName: 'id' }])
  pluginspace: Pluginspace;

  @ManyToOne(() => Plugintype, (plugintype) => plugintype.pluginlogs)
  @JoinColumn([{ name: 'plugintype_id', referencedColumnName: 'id' }])
  plugintype: Plugintype;

  @ManyToOne(() => Status, (status) => status.pluginlogs)
  @JoinColumn([{ name: 'status_id', referencedColumnName: 'id' }])
  status_2: Status;
}
