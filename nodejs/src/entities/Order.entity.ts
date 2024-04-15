import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Customer } from './Customer.entity';
import { Pluginspace } from './Pluginspace.entity';
import { Plugintype } from './Plugintype.entity';
import { Status } from './Status.entity';
import { Orderstatus } from './Orderstatus.entity';
import { Smartorder } from './Smartorder.entity';

@Index('pk_order', ['id'], { unique: true })
@Index('FK_order_pluginspace2_idx', ['pluginspaceId'], {})
@Index('FK_order_plugintype1_idx', ['plugintypeId'], {})
@Index('FK_order_status1_idx', ['statusId'], {})
@Entity('order', { schema: 'public' })
export class Order {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('json', { name: 'content', nullable: true })
  content: object | null;

  @Column('varchar', { name: 'account', nullable: true, length: 120 })
  account: string | null;

  @Column('varchar', { name: 'type', nullable: true, length: 120 })
  type: string | null;

  @Column('integer', { name: 'pluginspaceId' })
  pluginspaceId: number;

  @Column('integer', { name: 'plugintypeId' })
  plugintypeId: number;

  @Column('integer', { name: 'pluginconfigId', nullable: true })
  pluginconfigId: number | null;

  @Column('integer', { name: 'statusId' })
  statusId: number;

  @Column('integer', { name: 'locationId', nullable: true })
  locationId: number | null;

  @Column('integer', { name: 'classifierId', nullable: true })
  classifierId: number | null;

  @Column('varchar', {
    name: 'integration',
    nullable: true,
    length: 350,
  })
  integration: string | null;

  @Column('integer', { name: 'subcategoryId', nullable: true })
  subcategoryId: number | null;

  @Column('integer', { name: 'print', nullable: true })
  print: number | null;

  @Column('integer', { name: 'motiveRejectedId', nullable: true })
  motiveRejectedId: number | null;

  @Column('timestamp', { name: 'created', nullable: true })
  created: Date | null;

  @Column('timestamp', {
    name: 'updated',
    nullable: true,
    default: () => 'now()',
  })
  updated: Date | null;

  @Column('varchar', {
    name: 'orderidExt',
    nullable: true,
    length: 30,
  })
  orderidExt: string | null;

  @Column('numeric', {
    name: 'discountGeneral',
    nullable: true,
    precision: 14,
    scale: 2,
    default: () => '0',
  })
  discountGeneral: string | null;

  @Column('numeric', {
    name: 'deliveryTax',
    nullable: true,
    precision: 14,
    scale: 2,
    default: () => '0',
  })
  deliveryTax: string | null;

  @ManyToOne(() => Customer, (customer) => customer.orders)
  @JoinColumn([{ name: 'customerId', referencedColumnName: 'id' }])
  customer: Customer;

  @ManyToOne(() => Pluginspace, (pluginspace) => pluginspace.orders)
  @JoinColumn([{ name: 'pluginspaceId', referencedColumnName: 'id' }])
  pluginspace: Pluginspace;

  @ManyToOne(() => Plugintype, (plugintype) => plugintype.orders)
  @JoinColumn([{ name: 'plugintypeId', referencedColumnName: 'id' }])
  plugintype: Plugintype;

  @ManyToOne(() => Status, (status) => status.orders)
  @JoinColumn([{ name: 'statusId', referencedColumnName: 'id' }])
  status: Status;

  @OneToMany(() => Orderstatus, (orderstatus) => orderstatus.order)
  orderstatuses: Orderstatus[];

  @OneToMany(() => Smartorder, (smartorder) => smartorder.order)
  smartorders: Smartorder[];
}
