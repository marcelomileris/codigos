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
import { Ceprange } from './Ceprange.entity';
import { Classification } from './Classification.entity';
import { Grid } from './Grid.entity';
import { Location } from './Location.entity';
import { Mark } from './Mark.entity';
import { Ods } from './Ods.entity';
import { Orderstatus } from './Orderstatus.entity';
import { Pass } from './Pass.entity';
import { PermissionGroup } from './PermissionGroup.entity';
import { Post } from './Post.entity';
import { Product } from './Product.entity';
import { Terms } from './Terms.entity';
import { UserGroupLocation } from './UserGroupLocation.entity';

@Index('FK_user_customer1_idx', ['customerId'], {})
@Index('pluginspace_id_email', ['email', 'pluginspaceId'], { unique: true })
@Index('email', ['email'], {})
@Index('pk_user', ['id'], { unique: true })
@Index('FK_user_location1_idx', ['locationId'], {})
@Index('password', ['password'], {})
@Index('FK_user_permissiongroup', ['permissionGroupId'], {})
@Entity('user', { schema: 'public' })
export class User {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('integer', { name: 'pluginspaceId' })
  pluginspaceId: number;

  @Column('integer', { name: 'permissionGroupId' })
  permissionGroupId: number;

  @Column('integer', { name: 'locationId', nullable: true })
  locationId: number | null;

  @Column('integer', { name: 'customerId', nullable: true })
  customerId: number | null;

  @Column('enum', {
    name: 'type',
    nullable: true,
    enum: ['admin', 'owner', 'user', 'application', 'seller'],
    default: () => "'user'",
  })
  type: 'admin' | 'owner' | 'user' | 'application' | 'seller' | null;

  @Column('smallint', { name: 'adm', default: () => '0' })
  adm: number;

  @Column('varchar', { name: 'name', length: 120 })
  name: string;

  @Column('varchar', { name: 'email', length: 120 })
  email: string;

  @Column('varchar', {
    name: 'image',
    nullable: true,
    length: 255,
    default: () => "'default/default-user.jpg'",
  })
  image: string | null;

  @Column('varchar', { name: 'password', length: 128 })
  password: string;

  @Column('integer', { name: 'countLogin', nullable: true, default: () => '0' })
  countLogin: number | null;

  @Column('timestamp', { name: 'lastLogin', nullable: true })
  lastLogin: Date | null;

  @Column('integer', {
    name: 'changePassword',
    nullable: true,
    default: () => '1',
  })
  changePassword: number | null;

  @Column('text', { name: 'content', nullable: true })
  content: string | null;

  @Column('boolean', { name: 'status', nullable: true, default: () => 'true' })
  status: boolean | null;

  @Column('timestamp', {
    name: 'created',
    nullable: true,
    default: () => 'now()',
  })
  created: Date | null;

  @Column('timestamp', { name: 'updated', nullable: true })
  updated: Date | null;

  @Column('timestamp', { name: 'deleted', nullable: true })
  deleted: Date | null;

  @Column('integer', { name: 'removed', nullable: true, default: () => '0' })
  removed: number | null;

  @Column('varchar', {
    name: 'cpf',
    nullable: true,
    length: 20,
    default: () => "'0'",
  })
  cpf: string | null;

  @OneToMany(() => Appconfig, (appconfig) => appconfig.user)
  appconfigs: Appconfig[];

  @OneToMany(() => Ceprange, (ceprange) => ceprange.userCreated)
  cepranges: Ceprange[];

  @OneToMany(() => Ceprange, (ceprange) => ceprange.userDeleted)
  cepranges2: Ceprange[];

  @OneToMany(() => Ceprange, (ceprange) => ceprange.userUpdated)
  cepranges3: Ceprange[];

  @OneToMany(() => Classification, (classification) => classification.user)
  classifications: Classification[];

  @OneToMany(() => Grid, (grid) => grid.user)
  grs: Grid[];

  @OneToMany(() => Location, (location) => location.user2)
  locations: Location[];

  @OneToMany(() => Mark, (mark) => mark.user)
  marks: Mark[];

  @OneToMany(() => Ods, (ods) => ods.user)
  ods: Ods[];

  @OneToMany(() => Orderstatus, (orderstatus) => orderstatus.user)
  orderstatuses: Orderstatus[];

  @OneToMany(() => Pass, (pass) => pass.user)
  passes: Pass[];

  @OneToMany(() => PermissionGroup, (permissionGroup) => permissionGroup.user2)
  permissionGroups: PermissionGroup[];

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => Product, (product) => product.user)
  products: Product[];

  @OneToMany(() => Terms, (terms) => terms.user)
  terms: Terms[];

  @ManyToOne(() => Location, (location) => location.users)
  @JoinColumn([{ name: 'locationId', referencedColumnName: 'id' }])
  location: Location;

  @ManyToOne(
    () => PermissionGroup,
    (permissionGroup) => permissionGroup.users,
    { onDelete: 'RESTRICT', onUpdate: 'RESTRICT' },
  )
  @JoinColumn([{ name: 'permissionGroupId', referencedColumnName: 'id' }])
  permissionGroup: PermissionGroup;

  @OneToMany(
    () => UserGroupLocation,
    (userGroupLocation) => userGroupLocation.user,
  )
  userGroupLocations: UserGroupLocation[];
}
