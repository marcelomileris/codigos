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
import { Pluginspace } from './Pluginspace.entity';
import { Plugintype } from './Plugintype.entity';
import { User } from './User.entity';
import { OdsClassification } from './OdsClassification.entity';
import { Product } from './Product.entity';
import { ProductFavorite } from './ProductFavorite.entity';

@Index(
  'classification_parent_code_pluginspace',
  ['code', 'parent', 'pluginspaceId'],
  { unique: true },
)
@Index('classification_pluginsace_code', ['code', 'pluginspaceId'], {
  unique: true,
})
@Index('classification_un', ['id'], { unique: true })
@Index('classification_pk', ['id'], { unique: true })
@Index('fki_classification_pluginspace_id_fk', ['pluginspaceId'], {})
@Index('fki_classification_plugtype_id_pk', ['plugintypeId'], {})
@Entity('classification', { schema: 'public' })
export class Classification extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: number;

  @Column('varchar', {
    name: 'parent',
    nullable: true,
    unique: true,
    length: 40,
  })
  parent: string | null;

  @Column('varchar', { name: 'code', length: 40 })
  code: string;

  @Column('varchar', { name: 'name', length: 120 })
  name: string;

  @Column('integer', { name: 'pluginspaceId', unique: true })
  pluginspaceId: number;

  @Column('integer', { name: 'plugintypeId' })
  plugintypeId: number;

  @Column('varchar', {
    name: 'shortname',
    nullable: true,
    length: 60,
  })
  shortname: string | null;

  @Column('integer', { name: 'order', default: () => '0' })
  order: number;

  @Column('integer', { name: 'userId' })
  userId: number;

  @Column('varchar', { name: 'img', nullable: true, length: 320 })
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

  @Column('boolean', { name: 'status', default: () => 'true' })
  status: boolean;

  @ManyToOne(() => Pluginspace, (pluginspace) => pluginspace.classifications)
  @JoinColumn([{ name: 'pluginspaceId', referencedColumnName: 'id' }])
  pluginspace: Pluginspace;

  @ManyToOne(() => Plugintype, (plugintype) => plugintype.classifications)
  @JoinColumn([{ name: 'plugintypeId', referencedColumnName: 'id' }])
  plugintype: Plugintype;

  @ManyToOne(() => User, (user) => user.classifications)
  @JoinColumn([{ name: 'userId', referencedColumnName: 'id' }])
  user: User;

  @OneToMany(
    () => OdsClassification,
    (odsClassification) => odsClassification.classification,
  )
  odsClassifications: OdsClassification[];

  @OneToMany(() => Product, (product) => product.classification)
  products: Product[];

  @OneToMany(
    () => ProductFavorite,
    (productFavorite) => productFavorite.classification,
  )
  productFavorites: ProductFavorite[];
}
