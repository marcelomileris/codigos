import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from './Product.entity';

@Index('printsector_id', ['kdsId'], {})
@Index('product_id2', ['productId'], {})
@Entity('product_kds', { schema: 'public' })
export class ProductKds {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('integer', { name: 'productId' })
  productId: number;

  @Column('integer', { name: 'kdsId' })
  kdsId: number;

  @ManyToOne(() => Product, (product) => product.productKits)
  @JoinColumn([{ name: 'productId', referencedColumnName: 'id' }])
  product: Product;
}
