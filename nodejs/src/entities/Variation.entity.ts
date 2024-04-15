import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { LocalVariation } from './LocalVariation.entity';
import { Pluginspace } from './Pluginspace.entity';
import { Product } from './Product.entity';

@Index('pk_variation', ['id'], { unique: true })
@Index('FK_variation_product1_idx', ['productId'], {})
@Entity('variation', { schema: 'public' })
export class Variation {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('varchar', { name: 'name', nullable: true, length: 120 })
  name: string | null;

  @Column('integer', { name: 'product_id' })
  productId: number;

  @Column('varchar', { name: 'code', nullable: true, length: 120 })
  code: string | null;

  @Column('real', { name: 'price', nullable: true, precision: 24 })
  price: number | null;

  @Column('smallint', { name: 'removed', nullable: true, default: () => '0' })
  removed: number | null;

  @Column('timestamp', {
    name: 'created',
    nullable: true,
    default: () => 'now()',
  })
  created: Date | null;

  @Column('timestamp', {
    name: 'updated',
    nullable: true,
    default: () => 'now()',
  })
  updated: Date | null;

  @Column('timestamp', { name: 'deleted', nullable: true })
  deleted: Date | null;

  @Column('text', { name: 'description', nullable: true })
  description: string | null;

  @Column('integer', { name: 'status', nullable: true, default: () => '1' })
  status: number | null;

  @Column('smallint', {
    name: 'sku_exists',
    nullable: true,
    default: () => '0',
  })
  skuExists: number | null;

  @OneToMany(() => LocalVariation, (localVariation) => localVariation.product)
  localVariations: LocalVariation[];

  @ManyToOne(() => Pluginspace, (pluginspace) => pluginspace.variations)
  @JoinColumn([{ name: 'pluginspace_id', referencedColumnName: 'id' }])
  pluginspace: Pluginspace;

  @ManyToOne(() => Product, (product) => product.variations)
  @JoinColumn([{ name: 'product_id', referencedColumnName: 'id' }])
  product: Product;
}
