import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Customer } from './Customer.entity';

@Index('pk_customer_address_id', ['id'], { unique: true })
@Entity('customer_address', { schema: 'public' })
export class CustomerAddress {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('enum', {
    name: 'typeAddress',
    enum: ['delivery', 'payment', 'main'],
  })
  typeAddress: 'delivery' | 'payment' | 'main';

  @Column('varchar', { name: 'street', length: 100 })
  street: string;

  @Column('varchar', { name: 'extra', nullable: true, length: 100 })
  extra: string | null;

  @Column('varchar', { name: 'number', nullable: true, length: 10 })
  number: string | null;

  @Column('varchar', { name: 'district', length: 100 })
  district: string;

  @Column('varchar', { name: 'city', length: 100 })
  city: string;

  @Column('varchar', {
    name: 'reference',
    nullable: true,
    length: 100,
  })
  reference: string | null;

  @Column('varchar', { name: 'state', length: 2 })
  state: string;

  @Column('varchar', { name: 'zipCode', length: 10 })
  zipCode: string;

  @Column('json', { name: 'latlng' })
  latlng: object;

  @Column('varchar', { name: 'placeId', length: 250 })
  placeId: string;

  @Column('timestamp', {
    name: 'created',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created: Date;

  @Column('timestamp', {
    name: 'updated',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  updated: Date | null;

  @ManyToOne(() => Customer, (customer) => customer.customerAddresses)
  @JoinColumn([{ name: 'customerId', referencedColumnName: 'id' }])
  customer: Customer;
}
