import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Appconfig } from './Appconfig.entity';
import { Catalog } from './Catalog.entity';
import { Ceplist } from './Ceplist.entity';
import { Ceprange } from './Ceprange.entity';
import { Ceprangenegativo } from './Ceprangenegativo.entity';
import { Classification } from './Classification.entity';
import { Customer } from './Customer.entity';
import { CustomerCart } from './CustomerCart.entity';
import { EnvelopeConfimation } from './EnvelopeConfimation.entity';
import { Grid } from './Grid.entity';
import { Group } from './Group.entity';
import { KeyPair } from './KeyPair.entity';
import { Mark } from './Mark.entity';
import { MotiveRejected } from './MotiveRejected.entity';
import { Ods } from './Ods.entity';
import { OdsClassification } from './OdsClassification.entity';
import { OdsLocation } from './OdsLocation.entity';
import { OdsStatus } from './OdsStatus.entity';
import { Order } from './Order.entity';
import { Pass } from './Pass.entity';
import { PermissionGroup } from './PermissionGroup.entity';
import { PermissionPage } from './PermissionPage.entity';
import { Pluginlog } from './Pluginlog.entity';
import { Pluginmessage } from './Pluginmessage.entity';
import { Skin } from './Skin.entity';
import { PluginspaceModules } from './PluginspaceModules.entity';
import { PlugintypePluginspace } from './PlugintypePluginspace.entity';
import { Post } from './Post.entity';
import { Product } from './Product.entity';
import { ProductComments } from './ProductComments.entity';
import { ProductFavorite } from './ProductFavorite.entity';
import { ProductFractional } from './ProductFractional.entity';
import { ProductImages } from './ProductImages.entity';
import { ProductInterest } from './ProductInterest.entity';
import { ProductKit } from './ProductKit.entity';
import { SkuLocalVariation } from './SkuLocalVariation.entity';
import { Smartorder } from './Smartorder.entity';
import { Status } from './Status.entity';
import { Terms } from './Terms.entity';
import { Token } from './Token.entity';
import { UploadImagesStatus } from './UploadImagesStatus.entity';
import { Variation } from './Variation.entity';
import { MeasureUnit } from './MeasurementUnit.entity';

@Index('confirmationhash', ['confirmationHash'], {})
@Index('FK_pluginspace_user', ['createdUserId'], {})
@Index('pk_pluginspace', ['id'], { unique: true })
@Index('FK_pluginspace_skin', ['skinId'], {})
@Index('subdomain_UNIQUE', ['subdomain'], { unique: true })
@Index('subdomain', ['subdomain'], {})
@Entity('pluginspace', { schema: 'public' })
export class Pluginspace {
  [x: string]: any;
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('varchar', { name: 'name', length: 120 })
  name: string;

  @Column('varchar', {
    name: 'corporateName',
    nullable: true,
    length: 150,
  })
  corporateName: string | null;

  @Column('varchar', { name: 'cnpj', nullable: true, length: 20 })
  cnpj: string | null;

  @Column('varchar', { name: 'hash', nullable: true, length: 120 })
  hash: string | null;

  @Column('varchar', { name: 'subdomain', length: 120 })
  subdomain: string;

  @Column('varchar', { name: 'type', length: 255 })
  type: string;

  @Column('varchar', {
    name: 'imageLogin',
    nullable: true,
    length: 255,
    default: () => "'./public/default/images/logo-register.png'",
  })
  imageLogin: string | null;

  @Column('text', { name: 'permission', nullable: true })
  permission: string | null;

  @Column('json', { name: 'content', nullable: true })
  content: object | null;

  @Column('integer', { name: 'skinId', nullable: true, default: () => '1' })
  skinId: number | null;

  @Column('varchar', { name: 'image', nullable: true, length: 255 })
  image: string | null;

  @Column('boolean', { name: 'terms' })
  terms: boolean;

  @Column('varchar', {
    name: 'gmt',
    length: 50,
    default: () => "'-3:00'",
  })
  gmt: string;

  @Column('boolean', { name: 'translate', default: () => 'false' })
  translate: boolean;

  @Column('integer', { name: 'createdUserId', nullable: true })
  createdUserId: number | null;

  @Column('timestamp', {
    name: 'confirmationDateTime',
    nullable: true,
  })
  confirmationDateTime: Date | null;

  @Column('varchar', {
    name: 'confirmationHash',
    nullable: true,
    length: 128,
  })
  confirmationHash: string | null;

  @Column('boolean', { name: 'status', default: () => 'true' })
  status: boolean;

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

  @Column('integer', { name: 'removed', nullable: true, default: () => '0' })
  removed: number | null;

  @Column('integer', { name: 'parent', nullable: true, default: () => '0' })
  parent: number | null;

  @Column('varchar', {
    name: 'storeCode',
    nullable: true,
    length: 20,
  })
  storeCode: string | null;

  @Column('varchar', {
    name: 'defaultLanguage',
    nullable: true,
    length: 10,
    default: () => "'pt'",
  })
  defaultLanguage: string | null;

  @Column('varchar', {
    name: 'defaultCurrency',
    nullable: true,
    length: 50,
    default: () => "'R$'",
  })
  defaultCurrency: string | null;

  @OneToMany(() => Appconfig, (appconfig) => appconfig.pluginspace)
  appconfigs: Appconfig[];

  @OneToMany(() => Catalog, (catalog) => catalog.pluginspace)
  catalogs: Catalog[];

  @OneToMany(() => Ceplist, (ceplist) => ceplist.pluginspace)
  ceplists: Ceplist[];

  @OneToMany(() => Ceprange, (ceprange) => ceprange.pluginspace)
  cepranges: Ceprange[];

  @OneToMany(
    () => Ceprangenegativo,
    (ceprangenegativo) => ceprangenegativo.pluginspace,
  )
  ceprangenegativos: Ceprangenegativo[];

  @OneToMany(
    () => Classification,
    (classification) => classification.pluginspace,
  )
  classifications: Classification[];

  @OneToMany(() => Customer, (customer) => customer.pluginspace)
  customers: Customer[];

  @OneToMany(() => CustomerCart, (customerCart) => customerCart.pluginspace)
  customerCarts: CustomerCart[];

  @OneToMany(
    () => EnvelopeConfimation,
    (envelopeConfimation) => envelopeConfimation.pluginspace,
  )
  envelopeConfimations: EnvelopeConfimation[];

  @OneToMany(() => Grid, (grid) => grid.pluginspace)
  grs: Grid[];

  @OneToMany(() => Group, (group) => group.pluginspace)
  groups: Group[];

  @OneToOne(() => KeyPair, (keyPair) => keyPair.pluginspace)
  keyPair: KeyPair;

  @OneToMany(() => Mark, (mark) => mark.pluginspace)
  marks: Mark[];

  @OneToMany(
    () => MeasureUnit,
    (measurementUnit) => measurementUnit.pluginspace,
  )
  measurementUnits: MeasureUnit[];

  @OneToMany(
    () => MotiveRejected,
    (motiveRejected) => motiveRejected.pluginspace,
  )
  motiveRejecteds: MotiveRejected[];

  @OneToMany(() => Ods, (ods) => ods.pluginspace)
  ods: Ods[];

  @OneToMany(
    () => OdsClassification,
    (odsClassification) => odsClassification.pluginspace,
  )
  odsClassifications: OdsClassification[];

  @OneToMany(() => OdsLocation, (odsLocation) => odsLocation.pluginspace)
  odsLocations: OdsLocation[];

  @OneToMany(() => OdsStatus, (odsStatus) => odsStatus.pluginspace)
  odsStatuses: OdsStatus[];

  @OneToMany(() => Order, (order) => order.pluginspace)
  orders: Order[];

  @OneToMany(() => Pass, (pass) => pass.pluginspace)
  passes: Pass[];

  @OneToMany(
    () => PermissionGroup,
    (permissionGroup) => permissionGroup.pluginspace,
  )
  permissionGroups: PermissionGroup[];

  @OneToMany(
    () => PermissionPage,
    (permissionPage) => permissionPage.pluginspace,
  )
  permissionPages: PermissionPage[];

  @OneToMany(() => Pluginlog, (pluginlog) => pluginlog.pluginspace)
  pluginlogs: Pluginlog[];

  @OneToMany(() => Pluginmessage, (pluginmessage) => pluginmessage.pluginspace)
  pluginmessages: Pluginmessage[];

  @ManyToOne(() => Skin, (skin) => skin.pluginspaces, {
    onDelete: 'SET NULL',
    onUpdate: 'SET NULL',
  })
  @JoinColumn([{ name: 'skinId', referencedColumnName: 'id' }])
  skin: Skin;

  @OneToMany(
    () => PluginspaceModules,
    (pluginspaceModules) => pluginspaceModules.pluginspace,
  )
  pluginspaceModules: PluginspaceModules[];

  @OneToMany(
    () => PlugintypePluginspace,
    (plugintypePluginspace) => plugintypePluginspace.pluginspace,
  )
  plugintypePluginspaces: PlugintypePluginspace[];

  @OneToMany(() => Post, (post) => post.pluginspace)
  posts: Post[];

  @OneToMany(() => Product, (product) => product.pluginspace)
  products: Product[];

  @OneToMany(
    () => ProductComments,
    (productComments) => productComments.pluginspace,
  )
  productComments: ProductComments[];

  @OneToMany(
    () => ProductFavorite,
    (productFavorite) => productFavorite.pluginspace,
  )
  productFavorites: ProductFavorite[];

  @OneToMany(
    () => ProductFractional,
    (productFractional) => productFractional.pluginspace,
  )
  productFractionals: ProductFractional[];

  @OneToMany(() => ProductImages, (productImages) => productImages.pluginspace)
  productImages: ProductImages[];

  @OneToMany(
    () => ProductInterest,
    (productInterest) => productInterest.pluginspace,
  )
  productInterests: ProductInterest[];

  @OneToMany(() => ProductKit, (productKit) => productKit.pluginspace)
  productKits: ProductKit[];

  @OneToMany(
    () => SkuLocalVariation,
    (skuLocalVariation) => skuLocalVariation.pluginspace,
  )
  skuLocalVariations: SkuLocalVariation[];

  @OneToMany(() => Smartorder, (smartorder) => smartorder.pluginspace)
  smartorders: Smartorder[];

  @OneToMany(() => Status, (status) => status.pluginspace)
  statuses: Status[];

  @OneToMany(() => Terms, (terms) => terms.pluginspace)
  terms2: Terms[];

  @OneToMany(() => Token, (token) => token.pluginspace)
  tokens: Token[];

  @OneToMany(
    () => UploadImagesStatus,
    (uploadImagesStatus) => uploadImagesStatus.pluginspace,
  )
  uploadImagesStatuses: UploadImagesStatus[];

  @OneToMany(() => Variation, (variation) => variation.pluginspace)
  variations: Variation[];
}
