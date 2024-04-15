import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Status } from './Status.entity';

@Index('pk_analyzeorder', ['id'], { unique: true })
@Index('analyzeorder_id_IDX', ['id', 'orderId', 'orderidExt'], {})
@Index('analyzeorder_un', ['orderId', 'orderidExt'], { unique: true })
@Index('analyzeorder_FK_1', ['statusId'], {})
@Entity('analyzeorder', { schema: 'public' })
export class Analyzeorder {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('integer', { name: 'order_id' })
  orderId: number;

  @Column('varchar', { name: 'orderid_ext', length: 50 })
  orderidExt: string;

  @Column('integer', { name: 'pluginspace_id' })
  pluginspaceId: number;

  @Column('integer', { name: 'status_id' })
  statusId: number;

  @Column('varchar', { name: 'status_ext', length: 50 })
  statusExt: string;

  @Column('json', { name: 'order' })
  order: object;

  @Column('timestamp', {
    name: 'created',
    default: () => 'now()',
  })
  created: Date;

  @Column('timestamp', {
    name: 'updated',
    default: () => 'now()',
  })
  updated: Date;

  @ManyToOne(() => Status, (status) => status.analyzeorders, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'status_id', referencedColumnName: 'id' }])
  status: Status;
}
