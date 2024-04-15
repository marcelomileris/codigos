import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderScheduleAttempt } from './OrderScheduleAttempt';

@Index('idx_customer_id', ['customerId'], {})
@Index('pk_order_schedule', ['id'], { unique: true })
@Entity('order_schedule', { schema: 'public' })
export class OrderSchedule {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('integer', { name: 'orderId' })
  orderId: number;

  @Column('integer', { name: 'customerId' })
  customerId: number;

  @Column('integer', { name: 'orderIdTotvs' })
  orderIdTotvs: number;

  @Column('integer', { name: 'pluginconfigId' })
  pluginconfigId: number;

  @Column('text', { name: 'content', nullable: true })
  content: string | null;

  @Column('timestamp', {
    name: 'sendDate',
    default: () => 'now()',
  })
  sendDate: Date;

  @Column('varchar', { name: 'status', length: 255 })
  status: string;

  @Column('text', { name: 'customerData', nullable: true })
  customerData: string | null;

  @Column('text', { name: 'customerAddress', nullable: true })
  customerAddress: string | null;

  @Column('text', { name: 'items', nullable: true })
  items: string | null;

  @Column('text', { name: 'gatewaydata', nullable: true })
  gatewaydata: string | null;

  @Column('text', { name: 'paymentOnline', nullable: true })
  paymentOnline: string | null;

  @Column('text', { name: 'orderData', nullable: true })
  orderData: string | null;

  @Column('text', { name: 'dataTotvs', nullable: true })
  dataTotvs: string | null;

  @Column('timestamp', {
    name: 'created',
    default: () => 'now()',
  })
  created: Date;

  @Column('timestamp', {
    name: 'updated',
    nullable: true,
    default: () => 'now()',
  })
  updated: Date | null;

  @OneToMany(
    () => OrderScheduleAttempt,
    (orderScheduleAttempt) => orderScheduleAttempt.orderSchedule,
  )
  orderScheduleAttempts: OrderScheduleAttempt[];
}
