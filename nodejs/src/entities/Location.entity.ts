import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Appconfig } from './Appconfig.entity';
import { CustomerCart } from './CustomerCart.entity';
import { LocalVariation } from './LocalVariation.entity';
import { User } from './User.entity';
import { LocationPluginconfig } from './LocationPluginconfig.entity';
import { OdsLocation } from './OdsLocation.entity';
import { SkuLocalVariation } from './SkuLocalVariation.entity';
import { UserGroupLocation } from './UserGroupLocation.entity';

@Index('pk_location', ['id'], { unique: true })
@Index('FK_location_location1_idx', ['parentId'], {})
@Index('FK_store_pluginspace1_idx', ['pluginspaceId'], {})
@Index('FK_store_user1_idx', ['userId'], {})
@Entity('location', { schema: 'public' })
export class Location {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('varchar', { name: 'name', nullable: true, length: 120 })
  name: string | null;

  @Column('varchar', {
    name: 'description',
    nullable: true,
    length: 420,
  })
  description: string | null;

  @Column('varchar', { name: 'code', nullable: true, length: 120 })
  code: string | null;

  @Column('integer', { name: 'alloworder', nullable: true })
  alloworder: number | null;

  @Column('varchar', { name: 'type', nullable: true, length: 255 })
  type: string | null;

  @Column('integer', { name: 'pluginspaceId', nullable: true })
  pluginspaceId: number | null;

  @Column('boolean', { name: 'status', nullable: true, default: () => 'true' })
  status: boolean | null;

  @Column('varchar', { name: 'cep', nullable: true, length: 50 })
  cep: string | null;

  @Column('json', { name: 'address', nullable: true })
  address: JSON | null;

  @Column('varchar', { name: 'lat', nullable: true, length: 320 })
  lat: string | null;

  @Column('varchar', { name: 'lng', nullable: true, length: 320 })
  lng: string | null;

  @Column('varchar', { name: 'img', nullable: true, length: 250 })
  img: string | null;

  @Column('varchar', { name: 'latlng', nullable: true, length: 420 })
  latlng: string | null;

  @Column('varchar', { name: 'phone', nullable: true, length: 120 })
  phone: string | null;

  @Column('varchar', { name: 'content', nullable: true, length: 550 })
  content: string | null;

  @Column('integer', { name: 'userId', nullable: true })
  userId: number | null;

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

  @Column('integer', { name: 'parentId', nullable: true })
  parentId: number | null;

  @Column('time', { name: 'timeStart', nullable: true })
  timeStart: string | null;

  @Column('time', { name: 'timeEnd', nullable: true })
  timeEnd: string | null;

  @Column('integer', { name: 'order', nullable: true })
  order: number | null;

  @Column('varchar', { name: 'placeId', nullable: true, length: 200 })
  placeId: string | null;

  @OneToMany(() => Appconfig, (appconfig) => appconfig.location)
  appconfigs: Appconfig[];

  @OneToMany(() => CustomerCart, (customerCart) => customerCart.location)
  customerCarts: CustomerCart[];

  @OneToMany(() => LocalVariation, (localVariation) => localVariation.location)
  localVariations: LocalVariation[];

  @ManyToOne(() => Location, (location) => location.locations)
  @JoinColumn([{ name: 'parentId', referencedColumnName: 'id' }])
  parent: Location;

  @OneToMany(() => Location, (location) => location.parent)
  locations: Location[];

  @ManyToOne(() => User, (user) => user.locations)
  @JoinColumn([{ name: 'userId', referencedColumnName: 'id' }])
  user2: User;

  @OneToMany(
    () => LocationPluginconfig,
    (locationPluginconfig) => locationPluginconfig.location,
  )
  locationPluginconfigs: LocationPluginconfig[];

  @OneToMany(() => OdsLocation, (odsLocation) => odsLocation.location)
  odsLocations: OdsLocation[];

  @OneToMany(
    () => SkuLocalVariation,
    (skuLocalVariation) => skuLocalVariation.location,
  )
  skuLocalVariations: SkuLocalVariation[];

  @OneToMany(() => User, (user) => user.location)
  users: User[];

  @OneToMany(
    () => UserGroupLocation,
    (userGroupLocation) => userGroupLocation.location,
  )
  userGroupLocations: UserGroupLocation[];
}
