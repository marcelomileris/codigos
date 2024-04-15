import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Appconfig } from './Appconfig.entity';

@Index('appconfig_id', ['appconfigId'], {})
@Index('pk_appitems', ['id'], { unique: true })
@Index('pluginspace_id', ['pluginspaceId'], {})
@Entity('appitems', { schema: 'public' })
export class Appitems {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('varchar', {
    name: 'name',
    length: 250,
    default: () => "'0'",
  })
  name: string;

  @Column('varchar', {
    name: 'icon',
    length: 250,
    default: () => "'0'",
  })
  icon: string;

  @Column('text', { name: 'svg' })
  svg: string;

  @Column('integer', { name: 'auth', default: () => '0' })
  auth: number;

  @Column('varchar', {
    name: 'routetype',
    length: 250,
    default: () => "'0'",
  })
  routetype: string;

  @Column('varchar', {
    name: 'routecontent',
    length: 255,
    default: () => "'0'",
  })
  routecontent: string;

  @Column('integer', { name: 'status', nullable: true })
  status: number | null;

  @Column('varchar', {
    name: 'background',
    nullable: true,
    length: 50,
  })
  background: string | null;

  @Column('varchar', { name: 'color', nullable: true, length: 50 })
  color: string | null;

  @Column('integer', { name: 'order', nullable: true })
  order: number | null;

  @Column('integer', { name: 'appconfig_id', default: () => '0' })
  appconfigId: number;

  @Column('integer', { name: 'pluginspace_id', default: () => '0' })
  pluginspaceId: number;

  @Column('integer', { name: 'id_svgwebapp', nullable: true })
  idSvgwebapp: number | null;

  @ManyToOne(() => Appconfig, (appconfig) => appconfig.appitems)
  @JoinColumn([{ name: 'appconfig_id', referencedColumnName: 'id' }])
  appconfig: Appconfig;
}
