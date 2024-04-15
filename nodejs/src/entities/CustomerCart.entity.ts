import {
  BaseEntity,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Location } from './Location.entity';
import { Pluginspace } from './Pluginspace.entity';

@Index('pk_customer_cart', ['id'], { unique: true })
@Entity('customer_cart', { schema: 'public' })
export class CustomerCart extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('varchar', { name: 'cpfCustomer', length: 20 })
  cpfCustomer: string;

  @Column('varchar', { name: 'customerName', length: 100 })
  customerName: string;

  @Column('varchar', { name: 'phoneCustomer', length: 15 })
  phoneCustomer: string;

  @Column('varchar', { name: 'cpfSeller', length: 20 })
  cpfSeller: string;

  @Column('json', { name: 'jsonCart' })
  jsonCart: object;

  @Column('varchar', {
    name: 'status',
    length: 20,
    default: () => "'open'",
  })
  status: string;

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

  @Column('timestamp', { name: 'canceled', nullable: true })
  canceled: Date | null;

  @Column('varchar', { name: 'urlcart', length: 200 })
  urlcart: string;

  @Column('varchar', { name: 'guid', length: 150 })
  guid: string;

  @Column('varchar', {
    name: 'order',
    length: 30,
    default: () => '0',
  })
  order: string;

  @ManyToOne(() => Location, (location) => location.customerCarts)
  @JoinColumn([{ name: 'locationId', referencedColumnName: 'id' }])
  location: Location;

  @ManyToOne(() => Pluginspace, (pluginspace) => pluginspace.customerCarts)
  @JoinColumn([{ name: 'pluginspaceId', referencedColumnName: 'id' }])
  pluginspace: Pluginspace;
}
