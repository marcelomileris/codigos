import {
  BaseEntity,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CatalogItem } from '../entities/CatalogItem.entity';
import { Classification } from '../entities/Classification.entity';
import { MeasureUnit } from '../entities/MeasurementUnit.entity';
import { Pluginspace } from '../entities/Pluginspace.entity';
import { User } from '../entities/User.entity';
import { ProductImages } from '../entities/ProductImages.entity';
import { ProductKit } from '../entities/ProductKit.entity';
import { Variation } from '../entities/Variation.entity';
import { ProductOptionals } from './ProductOptionals.entity';
import { ProductFractional } from './ProductFractional.entity';
import { ProductStock } from './ProductStock.entity';
import { SkuLocalVariation } from './SkuLocalVariation.entity';
import { Mark } from './Mark.entity';
import { ProductFavorite } from './ProductFavorite.entity';
import { ProductComments } from './ProductComments.entity';
import { ProductInterest } from './ProductInterest.entity';

@Index('FK_product_subcategory1_idx', ['classificationId'], {})
@Index('IXD_product_code', ['code', 'pluginspaceId'], {})
@Index('unique_code_parent_pluginspace', ['code', 'parent', 'pluginspaceId'], {
  unique: true,
})
@Index('pk_product', ['id'], { unique: true })
@Index('FK_product_measurementunit1', ['measurementUnitId'], {})
@Index('FK_product_pluginspace1_idx', ['pluginspaceId'], {})
@Index('FK_product_user1_idx', ['userId'], {})
@Entity('product', { schema: 'public' })
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: number;

  @Column('varchar', { name: 'name', length: 150 })
  name: string;

  @Column('varchar', {
    name: 'description',
    nullable: true,
    length: 420,
  })
  description: string | null;

  @Column('varchar', {
    name: 'technicalSpecification',
    nullable: true,
  })
  technicalSpecification: string | null;

  @Column('integer', { name: 'order', nullable: true })
  order: number | null;

  @Column('varchar', { name: 'code', length: 120 })
  code: string;

  @Column('bigint', { name: 'classificationId', nullable: true })
  classificationId: number | null;

  @Column('integer', { name: 'userId' })
  userId: number;

  @Column('integer', { name: 'pluginspaceId' })
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

  @Column('timestamp', { name: 'deleted', nullable: true })
  deleted: Date | null;

  @Column('bigint', { name: 'measurementUnitId', nullable: true })
  measurementUnitId: number | null;

  @Column('varchar', { name: 'parent', nullable: true, unique: true })
  parent: string | null;

  @Column('bigint', { name: 'markId', nullable: true })
  markId: number | null;

  @Column('enum', {
    name: 'type',
    enum: ['product', 'optional', 'service', 'itemcombo', 'carvery', 'extra'],
    default: () => "'product'",
  })
  type: 'product' | 'optional' | 'service' | 'itemcombo' | 'carvery' | 'extra';

  @Column('boolean', { name: 'status', default: () => 'true' })
  status: boolean;

  @OneToMany(
    () => ProductFractional,
    (productFractional) => productFractional.product,
  )
  productFractionals: ProductFractional[];

  @OneToMany(() => CatalogItem, (catalogItem) => catalogItem.product)
  catalogItems: CatalogItem[];

  @ManyToOne(() => Classification, (classification) => classification.products)
  @JoinColumn([{ name: 'classificationId', referencedColumnName: 'id' }])
  classification: Classification;

  @ManyToOne(() => Mark, (mark) => mark.products)
  @JoinColumn([{ name: 'markId', referencedColumnName: 'id' }])
  mark: Mark;

  @ManyToOne(() => MeasureUnit, (measurementUnit) => measurementUnit.products)
  @JoinColumn([{ name: 'measurementUnitId', referencedColumnName: 'id' }])
  measurementUnit: MeasureUnit;

  @ManyToOne(() => Pluginspace, (pluginspace) => pluginspace.products)
  @JoinColumn([{ name: 'pluginspaceId', referencedColumnName: 'id' }])
  pluginspace: Pluginspace;

  @ManyToOne(() => User, (user) => user.products)
  @JoinColumn([{ name: 'userId', referencedColumnName: 'id' }])
  user: User;

  @OneToMany(() => ProductImages, (productImages) => productImages.product)
  productImages: ProductImages[];

  @OneToMany(() => ProductKit, (productKit) => productKit.product)
  productKits: ProductKit[];

  @OneToMany(() => ProductKit, (productKit) => productKit.productIdSon2)
  productKits2: ProductKit[];

  @OneToMany(
    () => ProductFavorite,
    (productFavorite) => productFavorite.product,
  )
  productFavorites: ProductFavorite[];

  @OneToMany(
    () => ProductOptionals,
    (productOptionals) => productOptionals.product,
  )
  productOptionals: ProductOptionals[];

  @OneToMany(() => Variation, (variation) => variation.product)
  variations: Variation[];

  @OneToMany(() => ProductStock, (productStock) => productStock.product)
  productStocks: ProductStock[];

  @OneToMany(
    () => SkuLocalVariation,
    (skuLocalVariation) => skuLocalVariation.product,
  )
  skuLocalVariations: SkuLocalVariation[];

  @OneToMany(
    () => ProductComments,
    (productComments) => productComments.product,
  )
  productComments: ProductComments[];

  @OneToMany(
    () => ProductInterest,
    (productInterest) => productInterest.product,
  )
  productInterests: ProductInterest[];
}
