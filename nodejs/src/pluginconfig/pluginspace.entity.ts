import {
  BaseEntity,
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Pluginconfig } from './pluginconfig.entity';

@Index('confirmationhash', ['confirmationHash'], {})
@Index('FK_pluginspace_user', ['createdUserId'], {})
@Index('pk_pluginspace', ['id'], { unique: true })
@Index('subdomain_UNIQUE', ['subdomain'], { unique: true })
@Index('subdomain', ['subdomain'], {})
@Entity('pluginspace', { schema: 'public' })
export class Pluginspace extends BaseEntity {
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
  content: JSON | null;

  @Column('varchar', { name: 'image', nullable: true, length: 255 })
  image: string | null;

  @Column('boolean', { name: 'terms', default: () => false })
  terms: boolean;

  @Column('varchar', {
    name: 'gmt',
    length: 50,
    default: () => "'-3:00'",
  })
  gmt: string;

  @Column('boolean', { name: 'translate', default: () => false })
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

  @Column('boolean', { name: 'status', nullable: false, default: () => true })
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

  @OneToMany(() => Pluginconfig, (pluginconfig) => pluginconfig.pluginspace)
  pluginconfigIds: Pluginconfig[];
}
