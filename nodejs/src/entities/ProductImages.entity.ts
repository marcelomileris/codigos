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

@Index('pk_product_images', ['id'], { unique: true })
@Index('fk_product_images_pluginspace1_idx', ['pluginspaceId'], {})
@Index('fk_product_images_product_idx', ['productId'], {})
@Entity('product_images', { schema: 'public' })
export class ProductImages {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('varchar', {
    name: 'path',
    nullable: true,
    length: 200,
    default: () => "'http://s3.amazonaws.com/img.pluginbot.ai'",
  })
  path: string | null;

  @Column('integer', { name: 'productId' })
  productId: number;

  @Column('integer', { name: 'pluginspaceId' })
  pluginspaceId: number;

  @Column('varchar', {
    name: 'imgsuffix',
    length: 200,
    default: () => "'public/default/no-image.png'",
  })
  imgsuffix: string;

  @Column('integer', { name: 'order', default: () => '0' })
  order: number;

  @Column('enum', {
    name: 'typeimg',
    enum: ['image', 'mainpicture', 'thumbpicture', 'imgsmall'],
    default: () => "'image'",
  })
  typeimg: 'image' | 'mainpicture' | 'thumbpicture' | 'imgsmall';

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

  @ManyToOne(() => Pluginspace, (pluginspace) => pluginspace.productImages)
  @JoinColumn([{ name: 'pluginspaceId', referencedColumnName: 'id' }])
  pluginspace: Pluginspace;

  @ManyToOne(() => Product, (product) => product.productImages)
  @JoinColumn([{ name: 'productId', referencedColumnName: 'id' }])
  product: Product;
}
