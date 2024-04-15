import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('pk_order_out', ['id'], { unique: true })
@Entity('order_out', { schema: 'public' })
export class OrderOut {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('integer', { name: 'user_id', nullable: true })
  userId: number | null;

  @Column('integer', { name: 'pluginspace_id', nullable: true })
  pluginspaceId: number | null;

  @Column('integer', { name: 'location_id', nullable: true })
  locationId: number | null;

  @Column('text', { name: 'orders' })
  orders: string;

  @Column('timestamp', { name: 'created', nullable: true })
  created: Date | null;
}
