import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Classification } from './Classification.entity';
import { Ods } from './Ods.entity';
import { Pluginspace } from './Pluginspace.entity';

@Index('ods_category_pkey', ['id'], { unique: true })
@Entity('ods_classification', { schema: 'public' })
export class OdsClassification {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('timestamp', {
    name: 'created',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created: Date;

  @Column('timestamp', {
    name: 'updated',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updated: Date;

  @Column('timestamp', { name: 'deleted', nullable: true })
  deleted: Date | null;

  @ManyToOne(
    () => Classification,
    (classification) => classification.odsClassifications,
  )
  @JoinColumn([{ name: 'classificationId', referencedColumnName: 'id' }])
  classification: Classification;

  @ManyToOne(() => Ods, (ods) => ods.odsClassifications)
  @JoinColumn([{ name: 'odsId', referencedColumnName: 'id' }])
  ods: Ods;

  @ManyToOne(() => Pluginspace, (pluginspace) => pluginspace.odsClassifications)
  @JoinColumn([{ name: 'pluginspaceId', referencedColumnName: 'id' }])
  pluginspace: Pluginspace;
}
