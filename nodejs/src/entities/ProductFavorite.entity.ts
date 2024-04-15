import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Classification } from './Classification.entity';
import { Customer } from './Customer.entity';
import { Pluginspace } from './Pluginspace.entity';
import { Product } from './Product.entity';

@Index('un_product_favorite', ['customerId', 'pluginspaceId', 'productId'], {
  unique: true,
})
@Index('product_favorite_pkey', ['id'], { unique: true })
@Entity('product_favorite', { schema: 'public' })
export class ProductFavorite {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('bigint', { name: 'productId', unique: true })
  productId: string;

  @Column('integer', { name: 'customerId', unique: true })
  customerId: number;

  @Column('integer', { name: 'rank', default: () => '0' })
  rank: number;

  @Column('integer', { name: 'pluginspaceId', unique: true })
  pluginspaceId: number;

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

  @ManyToOne(
    () => Classification,
    (classification) => classification.productFavorites,
  )
  @JoinColumn([{ name: 'classificationId', referencedColumnName: 'id' }])
  classification: Classification;

  @ManyToOne(() => Customer, (customer) => customer.productFavorites)
  @JoinColumn([{ name: 'customerId', referencedColumnName: 'id' }])
  customer: Customer;

  @ManyToOne(() => Pluginspace, (pluginspace) => pluginspace.productFavorites)
  @JoinColumn([{ name: 'pluginspaceId', referencedColumnName: 'id' }])
  pluginspace: Pluginspace;

  @ManyToOne(() => Product, (product) => product.productFavorites)
  @JoinColumn([{ name: 'productId', referencedColumnName: 'id' }])
  product: Product;
}
