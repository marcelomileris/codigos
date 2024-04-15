import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Subcategory } from './Subcategory';

@Index(
  'category_pluginspace_id_IDX',
  ['codeFather', 'pluginspaceId', 'trialPlugintypeId_4'],
  {},
)
@Index('pk_category', ['id'], { unique: true })
@Index('FK_category_pluginspace1_idx', ['pluginspaceId'], {})
@Index('FK_category_plugintype1_idx', ['trialPlugintypeId_4'], {})
@Index('FK_category_user1_idx', ['userId'], {})
@Entity('category', { schema: 'public' })
export class Category {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('integer', { name: 'pluginspace_id' })
  pluginspaceId: number;

  @Column('integer', { name: 'user_id' })
  userId: number;

  @Column('integer', { name: 'trial_plugintype_id_4' })
  trialPlugintypeId_4: number;

  @Column('varchar', { name: 'name', nullable: true, length: 120 })
  name: string | null;

  @Column('varchar', {
    name: 'shortname',
    nullable: true,
    length: 120,
  })
  shortname: string | null;

  @Column('integer', { name: 'order', nullable: true })
  order: number | null;

  @Column('varchar', { name: 'img', nullable: true, length: 320 })
  img: string | null;

  @Column('integer', { name: 'trial_status_9', nullable: true })
  trialStatus_9: number | null;

  @Column('timestamp', { name: 'created', nullable: true })
  created: Date | null;

  @Column('timestamp', {
    name: 'trial_updated_11',
    nullable: true,
  })
  trialUpdated_11: Date | null;

  @Column('timestamp', {
    name: 'trial_deleted_12',
    nullable: true,
  })
  trialDeleted_12: Date | null;

  @Column('integer', {
    name: 'trial_code_13',
    nullable: true,
    default: () => '0',
  })
  trialCode_13: number | null;

  @Column('varchar', {
    name: 'code_father',
    nullable: true,
    length: 40,
  })
  codeFather: string | null;

  @OneToMany(() => Subcategory, (subcategory) => subcategory.category)
  subcategories: Subcategory[];
}
