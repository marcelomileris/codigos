import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Ods } from './Ods.entity';
import { Pluginspace } from './Pluginspace.entity';
import { Status } from './Status.entity';

@Entity('ods_status', { schema: 'public' })
export class OdsStatus {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

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

  @ManyToOne(() => Ods, (ods) => ods.odsStatuses)
  @JoinColumn([{ name: 'odsId', referencedColumnName: 'id' }])
  ods: Ods;

  @ManyToOne(() => Pluginspace, (pluginspace) => pluginspace.odsStatuses)
  @JoinColumn([{ name: 'pluginspaceId', referencedColumnName: 'id' }])
  pluginspace: Pluginspace;

  @ManyToOne(() => Status, (status) => status.odsStatuses)
  @JoinColumn([{ name: 'statusId', referencedColumnName: 'id' }])
  status: Status;
}
