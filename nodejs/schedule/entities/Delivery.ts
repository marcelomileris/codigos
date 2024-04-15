import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('pk_delivery', ['id'], { unique: true })
@Index('pluginspace_id2', ['pluginspaceId'], {})
@Entity('delivery', { schema: 'public' })
export class Delivery {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('integer', { name: 'minKm' })
  minKm: number;

  @Column('integer', { name: 'maxKm' })
  maxKm: number;

  @Column('real', { name: 'value', precision: 24, default: () => '0' })
  value: number;

  @Column('integer', { name: 'pluginspaceId' })
  pluginspaceId: number;

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
}
