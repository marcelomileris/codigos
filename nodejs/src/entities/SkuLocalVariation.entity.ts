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
import { Product } from './Product.entity';

@Index('pk_sku_local_variation', ['id'], { unique: true })
@Index('product_code_unique', ['locationId', 'pluginspaceId', 'productCode'], {
  unique: true,
})
@Index(
  'fk_sku_local_variation_local_variation_idx_1',
  ['locationId', 'variationId'],
  {},
)
@Index('product_sku_unique', ['locationId', 'pluginspaceId', 'sku'], {
  unique: true,
})
@Entity('skuLocalVariation', { schema: 'public' })
export class SkuLocalVariation extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: number;

  @Column('integer', { name: 'locationId' })
  locationId: number;

  @Column('integer', { name: 'variationId', nullable: true })
  variationId: number | null;

  @Column('integer', { name: 'pluginspaceId' })
  pluginspaceId: number;

  @Column('boolean', { name: 'status', nullable: true })
  status: boolean | null;

  @Column('bigint', { name: 'productId', nullable: false })
  productId: number;

  @Column('bigint', { name: 'productCode', nullable: true, unique: true })
  productCode: number | null;

  @Column('varchar', {
    name: 'referenceCode',
    nullable: true,
    length: 50,
  })
  referenceCode: string | null;

  @Column('varchar', {
    name: 'colorCode',
    nullable: true,
    length: 50,
  })
  colorCode: string | null;

  @Column('varchar', { name: 'gridCod', nullable: true, length: 15 })
  gridCod: string | null;

  @Column('varchar', { name: 'gridName', nullable: true, length: 15 })
  gridName: string | null;

  @Column('varchar', { name: 'sku', unique: true, length: 255 })
  sku: string;

  @Column('real', { name: 'price', nullable: true, precision: 24 })
  price: number | null;

  @Column('real', {
    name: 'inventory',
    nullable: true,
    precision: 24,
    default: () => '0',
  })
  inventory: number | null;

  @Column('real', {
    name: 'minimumStock',
    nullable: true,
    precision: 24,
    default: () => '0',
  })
  minimumStock: number | null;

  @Column('varchar', { name: 'gtin', nullable: true, length: 100 })
  gtin: string | null;

  @Column('varchar', { name: 'mpn', nullable: true, length: 100 })
  mpn: string | null;

  @Column('varchar', { name: 'ncm', nullable: true, length: 100 })
  ncm: string | null;

  @Column('real', {
    name: 'costPrice',
    nullable: true,
    precision: 24,
    default: () => '0',
  })
  costPrice: number | null;

  @Column('real', {
    name: 'promotionalPrice',
    nullable: true,
    precision: 24,
    default: () => '0',
  })
  promotionalPrice: number | null;

  @Column('real', {
    name: 'weight',
    nullable: true,
    precision: 24,
    default: () => '0',
  })
  weight: number | null;

  @Column('real', {
    name: 'height',
    nullable: true,
    precision: 24,
    default: () => '0',
  })
  height: number | null;

  @Column('real', {
    name: 'width',
    nullable: true,
    precision: 24,
    default: () => '0',
  })
  width: number | null;

  @Column('real', {
    name: 'depth',
    nullable: true,
    precision: 24,
    default: () => '0',
  })
  depth: number | null;

  @Column('integer', { name: 'stockSituation', nullable: true })
  stockSituation: number | null;

  @Column('integer', { name: 'outOfStockSituation', nullable: true })
  outOfStockSituation: number | null;

  @Column('text', { name: 'context', nullable: true })
  context: string;

  @Column('varchar', { name: 'img', nullable: true, length: 255 })
  img: string | null;

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

  @ManyToOne(() => Location, (location) => location.skuLocalVariations)
  @JoinColumn([{ name: 'locationId', referencedColumnName: 'id' }])
  location: Location;

  @ManyToOne(() => Pluginspace, (pluginspace) => pluginspace.skuLocalVariations)
  @JoinColumn([{ name: 'pluginspaceId', referencedColumnName: 'id' }])
  pluginspace: Pluginspace;

  @ManyToOne(() => Product, (product) => product.skuLocalVariations)
  @JoinColumn([{ name: 'productId', referencedColumnName: 'id' }])
  product: Product;
}
