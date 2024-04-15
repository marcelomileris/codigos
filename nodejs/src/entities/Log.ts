import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('pk_log', ['id'], { unique: true })
@Index('FK_log_pluginspace', ['pluginspaceId'], {})
@Index('FK_log_user', ['userId'], {})
@Entity('log', { schema: 'public' })
export class Log {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('integer', { name: 'pluginspace_id' })
  pluginspaceId: number;

  @Column('varchar', { name: 'trial_type_3', length: 255 })
  trialType_3: string;

  @Column('varchar', { name: 'table', nullable: true, length: 50 })
  table: string | null;

  @Column('integer', { name: 'user_id', nullable: true })
  userId: number | null;

  @Column('varchar', { name: 'local', nullable: true, length: 200 })
  local: string | null;

  @Column('text', { name: 'content', nullable: true })
  content: string | null;

  @Column('varchar', {
    name: 'trial_ip_8',
    nullable: true,
    length: 20,
  })
  trialIp_8: string | null;

  @Column('text', { name: 'useragent', nullable: true })
  useragent: string | null;

  @Column('timestamp', {
    name: 'trial_created_10',
    nullable: true,
    default: () => 'now()',
  })
  trialCreated_10: Date | null;
}
