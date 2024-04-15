import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('pk_classifier', ['id'], { unique: true })
@Entity('classifier', { schema: 'public' })
export class Classifier {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('varchar', {
    name: 'trial_alternative_code_2',
    nullable: true,
    length: 30,
  })
  trialAlternativeCode_2: string | null;

  @Column('varchar', { name: 'standard_code', length: 30 })
  standardCode: string;

  @Column('varchar', { name: 'main_code', length: 30 })
  mainCode: string;

  @Column('integer', { name: 'trial_level_5' })
  trialLevel_5: number;

  @Column('varchar', { name: 'level_code', length: 100 })
  levelCode: string;

  @Column('varchar', { name: 'classification', length: 100 })
  classification: string;

  @Column('varchar', {
    name: 'trial_type_classification_8',
    length: 100,
  })
  trialTypeClassification_8: string;

  @Column('varchar', { name: 'trial_name_9', length: 100 })
  trialName_9: string;

  @Column('varchar', { name: 'shortname', length: 100 })
  shortname: string;

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
}
