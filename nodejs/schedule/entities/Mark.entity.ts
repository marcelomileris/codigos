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
import { Product } from './Product.entity';

@Index('mark_code_pluginspace', ['code', 'pluginspaceId'], { unique: true })
@Index('mark_pk', ['id'], { unique: true })
@Index('mark_un', ['name', 'pluginspaceId', 'plugintypeId'], { unique: true })
@Index('mark_FK', ['pluginspaceId'], {})
@Entity('mark', { schema: 'public' })
export class Mark extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('varchar', { name: 'name', unique: true, length: 100 })
  name: string;

  @Column('timestamp', {
    name: 'created',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  created: Date | null;

  @Column('timestamp', {
    name: 'updated',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  updated: Date | null;

  @Column('timestamp', { name: 'deleted', nullable: true })
  deleted: Date | null;

  @Column('varchar', {
    name: 'description',
    nullable: true,
    length: 250,
  })
  description: string | null;

  @Column('integer', { name: 'pluginspaceId' })
  pluginspaceId: number;

  @Column('integer', { name: 'plugintypeId', unique: true })
  plugintypeId: number;

  @Column('integer', { name: 'userId' })
  userId: number;

  @Column('boolean', { name: 'status', default: () => 'true' })
  status: boolean;

  @Column('varchar', {
    name: 'code',
    nullable: true,
    unique: true,
    length: 40,
  })
  code: string | null;

  @ManyToOne(() => Pluginspace, (pluginspace) => pluginspace.marks, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'pluginspaceId', referencedColumnName: 'id' }])
  pluginspace: Pluginspace;

  @ManyToOne(() => Plugintype, (plugintype) => plugintype.marks)
  @JoinColumn([{ name: 'plugintypeId', referencedColumnName: 'id' }])
  plugintype: Plugintype;

  @ManyToOne(() => User, (user) => user.marks)
  @JoinColumn([{ name: 'userId', referencedColumnName: 'id' }])
  user: User;

  @OneToMany(() => Product, (product) => product.mark)
  products: Product[];
}
