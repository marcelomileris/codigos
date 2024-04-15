import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('pk_reservation', ['id'], { unique: true })
@Index('location_id', ['locationId'], {})
@Index('pluginspace_id5', ['pluginspaceId'], {})
@Index('user_id1', ['userId'], {})
@Entity('reservation', { schema: 'public' })
export class Reservation {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('integer', { name: 'user_id', nullable: true })
  userId: number | null;

  @Column('integer', { name: 'location_id', nullable: true })
  locationId: number | null;

  @Column('integer', { name: 'pluginspace_id', nullable: true })
  pluginspaceId: number | null;

  @Column('varchar', { name: 'name', nullable: true, length: 50 })
  name: string | null;

  @Column('varchar', { name: 'room', nullable: true, length: 50 })
  room: string | null;

  @Column('varchar', { name: 'email', nullable: true, length: 150 })
  email: string | null;

  @Column('integer', { name: 'people', nullable: true })
  people: number | null;

  @Column('date', { name: 'date', nullable: true })
  date: string | null;

  @Column('time', { name: 'hour', nullable: true })
  hour: string | null;

  @Column('varchar', { name: 'table', nullable: true, length: 50 })
  table: string | null;

  @Column('varchar', { name: 'status', nullable: true, length: 255 })
  status: string | null;

  @Column('timestamp', {
    name: 'created',
    nullable: true,
    default: () => 'now()',
  })
  created: Date | null;
}
