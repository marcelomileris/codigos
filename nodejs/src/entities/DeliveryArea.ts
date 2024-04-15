import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('pk_delivery_area', ['id'], { unique: true })
@Index('fk_delivery_area_pluginspace', ['pluginspaceId'], {})
@Entity('deliveryArea', { schema: 'public' })
export class DeliveryArea {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @Column('varchar', { name: 'name', length: 30 })
  name: string;

  @Column('numeric', { name: 'price', precision: 10, scale: 2 })
  price: string;

  @Column('integer', { name: 'assortment' })
  assortment: number;

  @Column('bigint', { name: 'pluginspaceId' })
  pluginspaceId: string;

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
