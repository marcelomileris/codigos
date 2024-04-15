import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderSchedule } from './OrderSchedule';

@Index('pk_order_schedule_attempt', ['id'], { unique: true })
@Index('idx_order_schedule_id', ['orderScheduleId'], {})
@Entity('order_schedule_attempt', { schema: 'public' })
export class OrderScheduleAttempt {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('integer', { name: 'orderScheduleId' })
  orderScheduleId: number;

  @Column('varchar', { name: 'status', nullable: true, length: 255 })
  status: string | null;

  @Column('text', { name: 'content', nullable: true })
  content: string | null;

  @Column('text', { name: 'response', nullable: true })
  response: string | null;

  @Column('timestamp', {
    name: 'updated',
    nullable: true,
    default: () => 'now()',
  })
  updated: Date | null;

  @Column('timestamp', {
    name: 'created',
    default: () => 'now()',
  })
  created: Date;

  @ManyToOne(
    () => OrderSchedule,
    (orderSchedule) => orderSchedule.orderScheduleAttempts,
    { onDelete: 'CASCADE', onUpdate: 'RESTRICT' },
  )
  @JoinColumn([{ name: 'orderScheduleId', referencedColumnName: 'id' }])
  orderSchedule: OrderSchedule;
}
