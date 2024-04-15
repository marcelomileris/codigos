import {
  BaseEntity,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Pluginspace } from './Pluginspace.entity';
import { Plugintype } from './Plugintype.entity';
import { User } from './User.entity';

@Index('grid_code_pluginspace', ['code', 'pluginspaceId'], { unique: true })
@Index('pk_grid', ['id'], { unique: true })
@Index('FK_grid_pluginspace1_idx', ['pluginspaceId'], {})
@Index('FK_grid_plugintype1_idx', ['plugintypeId'], {})
@Index('FK_grid_user1_idx', ['userId'], {})
@Entity('grid', { schema: 'public' })
export class Grid extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('varchar', { name: 'name', nullable: true, length: 120 })
  name: string | null;

  @Column('text', { name: 'variation', nullable: true })
  variation: string | null;

  @Column('integer', { name: 'pluginspaceId', unique: true })
  pluginspaceId: number;

  @Column('integer', { name: 'userId' })
  userId: number;

  @Column('integer', { name: 'plugintypeId' })
  plugintypeId: number;

  @Column('varchar', {
    name: 'jsonLanguage',
    nullable: true,
    length: 512,
  })
  jsonLanguage: string | null;

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

  @Column('varchar', {
    name: 'code',
    nullable: true,
    unique: true,
    length: 20,
  })
  code: string | null;

  @Column('varchar', {
    name: 'typeGrid',
    nullable: true,
    length: 50,
    default: () => "'TAMANHO'",
  })
  typeGrid: string | null;

  @Column('boolean', { name: 'status', default: () => 'true' })
  status: boolean;

  @ManyToOne(() => Pluginspace, (pluginspace) => pluginspace.grs, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'pluginspaceId', referencedColumnName: 'id' }])
  pluginspace: Pluginspace;

  @ManyToOne(() => Plugintype, (plugintype) => plugintype.grs, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'plugintypeId', referencedColumnName: 'id' }])
  plugintype: Plugintype;

  @ManyToOne(() => User, (user) => user.grs, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'userId', referencedColumnName: 'id' }])
  user: User;
}
