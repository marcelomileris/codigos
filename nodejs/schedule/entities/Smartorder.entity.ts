import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from './Order.entity';
import { Pluginspace } from './Pluginspace.entity';

@Index('category_id', ['classificationId'], {})
@Index('pk_smartorder', ['id'], { unique: true })
@Index('order_id1', ['orderId'], {})
@Index('FK_order_pluginlog1_idx', ['pluginlogId'], {})
@Index('FK_order_pluginspace1_idx', ['pluginspaceId'], {})
@Entity('smartorder', { schema: 'public' })
export class Smartorder {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('integer', { name: 'pluginlogId', nullable: true })
  pluginlogId: number | null;

  @Column('integer', { name: 'orderId', nullable: true })
  orderId: number | null;

  @Column('integer', { name: 'pluginspaceId' })
  pluginspaceId: number;

  @Column('integer', { name: 'classificationId', nullable: true })
  classificationId: number | null;

  @Column('real', {
    name: 'quantity',
    nullable: true,
    precision: 24,
    default: () => '0',
  })
  quantity: number | null;

  @Column('real', { name: 'cost', nullable: true, precision: 24 })
  cost: number | null;

  @Column('real', { name: 'price', nullable: true, precision: 24 })
  price: number | null;

  @Column('varchar', { name: 'code', nullable: true, length: 120 })
  code: string | null;

  @Column('varchar', { name: 'sku', nullable: true, length: 255 })
  sku: string | null;

  @Column('json', { name: 'content', nullable: true })
  content: object | null;

  @Column('timestamp', {
    name: 'created',
    nullable: true,
    default: () => 'now()',
  })
  created: Date | null;

  @Column('integer', { name: 'status', nullable: true })
  status: number | null;

  @Column('numeric', {
    name: 'discount',
    nullable: true,
    precision: 14,
    scale: 2,
    default: () => '0',
  })
  discount: string | null;

  @Column('varchar', {
    name: 'orderidExt',
    nullable: true,
    length: 30,
  })
  orderidExt: string | null;

  @ManyToOne(() => Order, (order) => order.smartorders)
  @JoinColumn([{ name: 'orderId', referencedColumnName: 'id' }])
  order: Order;

  @ManyToOne(() => Pluginspace, (pluginspace) => pluginspace.smartorders)
  @JoinColumn([{ name: 'pluginspaceId', referencedColumnName: 'id' }])
  pluginspace: Pluginspace;
}
