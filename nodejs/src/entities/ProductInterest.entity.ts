import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Customer } from './Customer.entity';
import { Pluginspace } from './Pluginspace.entity';
import { Product } from './Product.entity';

@Index('product_interest_pkey', ['id'], { unique: true })
@Entity('product_interest', { schema: 'public' })
export class ProductInterest {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @Column('boolean', { name: 'status', nullable: true })
  status: boolean | null;

  @Column('timestamp', {
    name: 'initialValidity',
    default: () => 'CURRENT_TIMESTAMP',
  })
  initialValidity: Date;

  @Column('timestamp', { name: 'finalValidity' })
  finalValidity: Date;

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

  @ManyToOne(() => Customer, (customer) => customer.productInterests)
  @JoinColumn([{ name: 'customerId', referencedColumnName: 'id' }])
  customer: Customer;

  @ManyToOne(() => Pluginspace, (pluginspace) => pluginspace.productInterests)
  @JoinColumn([{ name: 'pluginspaceId', referencedColumnName: 'id' }])
  pluginspace: Pluginspace;

  @ManyToOne(() => Product, (product) => product.productInterests)
  @JoinColumn([{ name: 'productId', referencedColumnName: 'id' }])
  product: Product;
}
