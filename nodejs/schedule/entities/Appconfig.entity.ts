import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Location } from './Location.entity';
import { Pluginspace } from './Pluginspace.entity';
import { User } from './User.entity';
import { Appitems } from './Appitems.entity';

@Index('pk_appconfig', ['id'], { unique: true })
@Index('FK_appconfig_location1_idx', ['locationId'], {})
@Index('FK_appconfig_pluginspace1_idx', ['pluginspaceId'], {})
@Index('FK_appconfig_user1_idx', ['userId'], {})
@Entity('appconfig', { schema: 'public' })
export class Appconfig {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('integer', { name: 'pluginspaceId' })
  pluginspaceId: number;

  @Column('varchar', { name: 'name', nullable: true, length: 120 })
  name: string | null;

  @Column('enum', {
    name: 'type',
    nullable: true,
    enum: ['qr', 'menu', 'robot', 'table', 'seller'],
  })
  type: 'qr' | 'menu' | 'robot' | 'table' | 'seller' | null;

  @Column('enum', {
    name: 'template',
    nullable: true,
    enum: [
      'healthcare',
      'hospitality',
      'restaurant',
      'retail',
      'newhospitality',
      'varejo',
      'fashion',
      'food',
    ],
  })
  template:
    | 'healthcare'
    | 'hospitality'
    | 'restaurant'
    | 'retail'
    | 'newhospitality'
    | 'varejo'
    | 'fashion'
    | 'food'
    | null;

  @Column('varchar', { name: 'color', nullable: true, length: 50 })
  color: string | null;

  @Column('varchar', {
    name: 'deliveryType',
    nullable: true,
    length: 255,
    default: () => "'area'",
  })
  deliveryType: string | null;

  @Column('varchar', { name: 'code', nullable: true, length: 50 })
  code: string | null;

  @Column('text', { name: 'info', nullable: true })
  info: string | null;

  @Column('json', { name: 'content', nullable: true })
  content: object | null;

  @Column('integer', { name: 'auth', nullable: true })
  auth: number | null;

  @Column('varchar', {
    name: 'background',
    nullable: true,
    length: 450,
  })
  background: string | null;

  @Column('varchar', { name: 'img', nullable: true, length: 240 })
  img: string | null;

  @Column('varchar', { name: 'icon', nullable: true, length: 240 })
  icon: string | null;

  @Column('varchar', {
    name: 'banner',
    nullable: true,
    length: 240,
    default: () => "'public/default/no-image.png'",
  })
  banner: string | null;

  @Column('varchar', { name: 'hash', nullable: true, length: 120 })
  hash: string | null;

  @Column('integer', { name: 'userId' })
  userId: number;

  @Column('integer', { name: 'locationId', nullable: true })
  locationId: number | null;

  @Column('integer', { name: 'tableLocation', nullable: true })
  tableLocation: number | null;

  @Column('integer', { name: 'order', nullable: true })
  order: number | null;

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

  @ManyToOne(() => Location, (location) => location.appconfigs)
  @JoinColumn([{ name: 'locationId', referencedColumnName: 'id' }])
  location: Location;

  @ManyToOne(() => Pluginspace, (pluginspace) => pluginspace.appconfigs)
  @JoinColumn([{ name: 'pluginspaceId', referencedColumnName: 'id' }])
  pluginspace: Pluginspace;

  @ManyToOne(() => User, (user) => user.appconfigs)
  @JoinColumn([{ name: 'userId', referencedColumnName: 'id' }])
  user: User;

  @OneToMany(() => Appitems, (appitems) => appitems.appconfig)
  appitems: Appitems[];
}
