import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('pk_flags_protest', ['id'], { unique: true })
@Entity('flags_protest', { schema: 'public' })
export class FlagsProtest {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('integer', { name: 'trial_user_id_2' })
  trialUserId_2: number;

  @Column('integer', { name: 'pluginspace_id' })
  pluginspaceId: number;

  @Column('text', { name: 'locations' })
  locations: string;

  @Column('integer', { name: 'sector_id' })
  sectorId: number;

  @Column('text', { name: 'trial_flag_6' })
  trialFlag_6: string;

  @Column('timestamp', { name: 'created', nullable: true })
  created: Date | null;
}
