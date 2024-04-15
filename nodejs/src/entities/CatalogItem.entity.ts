import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from './Product.entity';

@Index('catalog_item_id_pk', ['id'], { unique: true })
@Entity('catalogItem', { schema: 'public' })
export class CatalogItem {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('integer', { name: 'order', nullable: true })
  order: number | null;

  @Column('boolean', { name: 'status', default: () => 'true' })
  status: boolean;

  @Column('bigint', { name: 'catalogId' })
  catalogId: string;

  @ManyToOne(() => Product, (product) => product.catalogItems)
  @JoinColumn([{ name: 'productId', referencedColumnName: 'id' }])
  product: Product;
}
