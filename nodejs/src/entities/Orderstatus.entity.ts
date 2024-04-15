import {
  BaseEntity,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from './Order.entity';
import { Status } from './Status.entity';
import { User } from './User.entity';

@Index('pk_orderstatus', ['id'], { unique: true })
@Index('order_id', ['orderId'], {})
@Index('FK_orderstatus_status1_idx', ['statusId'], {})
@Index('user_id', ['userId'], {})
@Entity('orderStatus', { schema: 'public' })
export class Orderstatus extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('integer', { name: 'status', nullable: true })
  status: number | null;

  @Column('integer', { name: 'orderId', nullable: true })
  orderId: number | null;

  @Column('timestamp', {
    name: 'created',
    nullable: true,
    default: () => 'now()',
  })
  created: Date | null;

  @Column('integer', { name: 'statusId' })
  statusId: number;

  @Column('integer', { name: 'userId', nullable: true })
  userId: number | null;

  @Column('varchar', { name: 'note', nullable: true, length: 450 })
  note: string | null;

  @Column('varchar', {
    name: 'orderidExt',
    nullable: true,
    length: 30,
  })
  orderidExt: string | null;

  @ManyToOne(() => Order, (order) => order.orderstatuses)
  @JoinColumn([{ name: 'orderId', referencedColumnName: 'id' }])
  order: Order;

  @ManyToOne(() => Status, (status) => status.orderstatuses)
  @JoinColumn([{ name: 'statusId', referencedColumnName: 'id' }])
  status2: Status;

  @ManyToOne(() => User, (user) => user.orderstatuses)
  @JoinColumn([{ name: 'userId', referencedColumnName: 'id' }])
  user: User;
}
