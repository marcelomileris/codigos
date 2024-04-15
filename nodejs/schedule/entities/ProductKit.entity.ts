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

@Index('pk_product_kit', ['id'], { unique: true })
@Index('fk_product_kit_product_idx', ['productId'], {})
@Index('fk_product_kit_product1_idx', ['productIdSon'], {})
@Entity('product_kit', { schema: 'public' })
export class ProductKit {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('integer', { name: 'productId' })
  productId: number;

  @Column('integer', { name: 'productIdSon' })
  productIdSon: number;

  @Column('integer', { name: 'codeMainParent', nullable: true })
  codeMainParent: number | null;

  @Column('integer', { name: 'codeChildPattern', nullable: true })
  codeChildPattern: number | null;

  @Column('numeric', {
    name: 'unitDiscount',
    nullable: true,
    precision: 10,
    scale: 2,
  })
  unitDiscount: string | null;

  @Column('varchar', {
    name: 'shortDescription',
    nullable: true,
    length: 150,
  })
  shortDescription: string | null;

  @Column('timestamp', { name: 'endValidity' })
  endValidity: Date;

  @Column('timestamp', { name: 'startValidity' })
  startValidity: Date;

  @Column('varchar', {
    name: 'serialNumber',
    nullable: true,
    length: 150,
  })
  serialNumber: string | null;

  @Column('integer', { name: 'inventory' })
  inventory: number;

  @Column('enum', {
    name: 'typeValueItem',
    enum: ['Original', 'Fixo', 'Desconto'],
  })
  typeValueItem: 'Original' | 'Fixo' | 'Desconto';

  @Column('numeric', { name: 'unitaryValue', precision: 10, scale: 2 })
  unitaryValue: string;

  @ManyToOne(() => Pluginspace, (pluginspace) => pluginspace.productKits)
  @JoinColumn([{ name: 'pluginspaceId', referencedColumnName: 'id' }])
  pluginspace: Pluginspace;

  @ManyToOne(() => Product, (product) => product.productKits, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'productId', referencedColumnName: 'id' }])
  product: Product;

  @ManyToOne(() => Product, (product) => product.productKits2, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'productIdSon', referencedColumnName: 'id' }])
  productIdSon2: Product;
}
