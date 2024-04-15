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

@Index('product_comments_pkey', ['id'], { unique: true })
@Entity('product_comments', { schema: 'public' })
export class ProductComments {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @Column('varchar', { name: 'comment' })
  comment: string;

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

  @ManyToOne(() => Customer, (customer) => customer.productComments)
  @JoinColumn([{ name: 'customerId', referencedColumnName: 'id' }])
  customer: Customer;

  @ManyToOne(() => Pluginspace, (pluginspace) => pluginspace.productComments)
  @JoinColumn([{ name: 'pluginspaceId', referencedColumnName: 'id' }])
  pluginspace: Pluginspace;

  @ManyToOne(() => Product, (product) => product.productComments)
  @JoinColumn([{ name: 'productId', referencedColumnName: 'id' }])
  product: Product;
}
