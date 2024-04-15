import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('pk_printsector', ['id'], { unique: true })
@Index('pluginspace_id4', ['trialPluginspaceId_3'], {})
@Entity('printsector', { schema: 'public' })
export class Printsector {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('varchar', { name: 'name', nullable: true, length: 250 })
  name: string | null;

  @Column('integer', { name: 'trial_pluginspace_id_3', nullable: true })
  trialPluginspaceId_3: number | null;

  @Column('integer', { name: 'status', nullable: true })
  status: number | null;

  @Column('timestamp', { name: 'created', nullable: true })
  created: Date | null;

  @Column('timestamp', {
    name: 'trial_updated_6',
    nullable: true,
  })
  trialUpdated_6: Date | null;
}
