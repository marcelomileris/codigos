import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from './Category';

@Index('FK_subcategory_category1_idx', ['categoryId'], {})
@Index(
  'subcategory_pluginspace_id_IDX',
  ['codeFather', 'codeSon', 'pluginspaceId'],
  {},
)
@Index('pk_subcategory', ['id'], { unique: true })
@Index('FK_subcategory_pluginspace1_idx', ['pluginspaceId'], {})
@Entity('subcategory', { schema: 'public' })
export class Subcategory {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('varchar', { name: 'name', nullable: true, length: 120 })
  name: string | null;

  @Column('varchar', {
    name: 'img',
    nullable: true,
    length: 320,
    default: () => "'public/default/no-image.png'",
  })
  img: string | null;

  @Column('integer', { name: 'status', nullable: true })
  status: number | null;

  @Column('integer', { name: 'category_id', nullable: true })
  categoryId: number | null;

  @Column('integer', { name: 'pluginspace_id' })
  pluginspaceId: number;

  @Column('integer', { name: 'order', nullable: true })
  order: number | null;

  @Column('varchar', { name: 'type', nullable: true, length: 50 })
  type: string | null;

  @Column('time', {
    name: 'time_start',
    nullable: true,
    default: () => "'00:00:00'",
  })
  timeStart: string | null;

  @Column('time', {
    name: 'time_end',
    nullable: true,
    default: () => "'23:59:59'",
  })
  timeEnd: string | null;

  @Column('integer', { name: 'level', nullable: true, default: () => '0' })
  level: number | null;

  @Column('integer', { name: 'code', nullable: true })
  code: number | null;

  @Column('varchar', {
    name: 'code_son',
    nullable: true,
    length: 40,
    default: () => "'0'",
  })
  codeSon: string | null;

  @Column('varchar', {
    name: 'code_father',
    nullable: true,
    length: 40,
    default: () => "'0'",
  })
  codeFather: string | null;

  @ManyToOne(() => Category, (category) => category.subcategories, {
    onDelete: 'SET NULL',
  })
  @JoinColumn([{ name: 'category_id', referencedColumnName: 'id' }])
  category: Category;
}
