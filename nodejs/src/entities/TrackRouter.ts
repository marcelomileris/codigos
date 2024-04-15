import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('pk_track_router', ['id'], { unique: true })
@Entity('track_router', { schema: 'public' })
export class TrackRouter {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('varchar', { name: 'ip', nullable: true, length: 50 })
  ip: string | null;

  @Column('varchar', { name: 'route', nullable: true, length: 255 })
  route: string | null;

  @Column('varchar', { name: 'url', nullable: true, length: 255 })
  url: string | null;

  @Column('timestamp', {
    name: 'created',
    nullable: true,
    default: () => 'now()',
  })
  created: Date | null;

  @Column('integer', { name: 'targetId', nullable: true })
  targetId: number | null;

  @Column('text', { name: 'desc', nullable: true })
  desc: string | null;

  @Column('integer', { name: 'pluginspace_id', nullable: true })
  pluginspaceId: number | null;
}
