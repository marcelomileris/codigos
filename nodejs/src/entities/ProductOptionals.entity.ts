import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from './Product.entity';

@Index('product_optionals_id', ['id'], { unique: true })
@Entity('product_optionals', { schema: 'public' })
export class ProductOptionals {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @Column('bigint', { name: 'pluginspaceId' })
  pluginspaceId: string;

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

  @ManyToOne(() => Product, (product) => product.productOptionals)
  @JoinColumn([{ name: 'productId', referencedColumnName: 'id' }])
  product: Product;

  @ManyToOne(() => Product, (product) => product.productOptionals)
  @JoinColumn([{ name: 'productIdOptional', referencedColumnName: 'id' }])
  productIdOptional: Product;
}
