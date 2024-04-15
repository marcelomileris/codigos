import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Customer } from './Customer.entity';

@Index('pk_customer_phones_id', ['id'], { unique: true })
@Entity('customer_phones', { schema: 'public' })
export class CustomerPhones {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('enum', {
    name: 'typePhone',
    enum: ['principal', 'secondary', 'message', 'cell', 'landline'],
    default: () => "'principal'",
  })
  typePhone: 'principal' | 'secondary' | 'message' | 'cell' | 'landline';

  @Column('varchar', { name: 'numberPhone', length: 15 })
  numberPhone: string;

  @ManyToOne(() => Customer, (customer) => customer.customerPhones)
  @JoinColumn([{ name: 'customerId', referencedColumnName: 'id' }])
  customer: Customer;
}
