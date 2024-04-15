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
import { Product } from './Product.entity';


@Index('pk_measurement_unit', ['id'], { unique: true })
@Index(
  'measurement_code_description_pluginspace',
  ['code', 'description', 'pluginspaceId'],
  { unique: true },
)
@Entity('measurementUnit', { schema: 'public' })
export class MeasureUnit extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('varchar', { name: 'code', length: 40, nullable: false })
  code: string;

  @Column('integer', { name: 'pluginspaceId' })
  pluginspaceId: number;

  @Column('varchar', { name: 'shortname', unique: true, length: 50 })
  shortname: string;

  @Column('varchar', { name: 'description', length: 50 })
  description: string;

  @Column('boolean', { name: 'status', default: () => true })
  status: boolean;

  @Column('timestamp', {
    name: 'created',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  created: Date | null;

  @Column('timestamp', {
    name: 'updated',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updated: Date;

  @Column('timestamp', { name: 'deleted', nullable: true })
  deleted: Date | null;

  @ManyToOne(() => Pluginspace, (pluginspace) => pluginspace.measurementUnits)
  @JoinColumn([{ name: 'pluginspaceId', referencedColumnName: 'id' }])
  pluginspace: Pluginspace;

  @OneToMany(() => Product, (product) => product.measurementUnit)
  products: Product[];
}
