import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Pluginspace } from './Pluginspace.entity';
import { Product } from './Product.entity';

@Index('product_fractional_pk', ['id'], { unique: true })
@Entity('product_fractional', { schema: 'public' })
export class ProductFractional {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @Column('enum', { name: 'type', enum: ['proportional', 'biggest'] })
  type: 'proportional' | 'biggest';

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

  @ManyToOne(() => Pluginspace, (pluginspace) => pluginspace.productFractionals)
  @JoinColumn([{ name: 'pluginspaceId', referencedColumnName: 'id' }])
  pluginspace: Pluginspace;

  @ManyToOne(() => Product, (product) => product.productFractionals)
  @JoinColumn([{ name: 'productId', referencedColumnName: 'id' }])
  product: Product;
}
