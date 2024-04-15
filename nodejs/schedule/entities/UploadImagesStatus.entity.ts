import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Pluginspace } from './Pluginspace.entity';

@Index('upload_images_status_pk', ['id'], { unique: true })
@Entity('upload_images_status', { schema: 'public' })
export class UploadImagesStatus {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @Column('timestamp', {
    name: 'time_start',
    default: () => 'CURRENT_TIMESTAMP',
  })
  timeStart: Date;

  @Column('timestamp', {
    name: 'time_end',
    default: () => 'CURRENT_TIMESTAMP',
  })
  timeEnd: Date;

  @Column('varchar', {
    name: 'description',
    nullable: true,
    length: 100,
  })
  description: string | null;

  @Column('integer', { name: 'total_products', nullable: true })
  totalProducts: number | null;

  @Column('integer', { name: 'synchronized_products', nullable: true })
  synchronizedProducts: number | null;

  @Column('boolean', { name: 'sku_status', default: () => 'false' })
  skuStatus: boolean;

  @ManyToOne(
    () => Pluginspace,
    (pluginspace) => pluginspace.uploadImagesStatuses,
  )
  @JoinColumn([{ name: 'pluginspace_id', referencedColumnName: 'id' }])
  pluginspace: Pluginspace;
}
