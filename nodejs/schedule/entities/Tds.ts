import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('pk_tds', ['id'], { unique: true })
@Index('pluginspace_id6', ['pluginspaceId'], {})
@Entity('tds', { schema: 'public' })
export class Tds {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('varchar', {
    name: 'table_number',
    nullable: true,
    length: 50,
  })
  tableNumber: string | null;

  @Column('varchar', {
    name: 'trial_token_3',
    nullable: true,
    length: 50,
  })
  trialToken_3: string | null;

  @Column('varchar', { name: 'status', length: 255 })
  status: string;

  @Column('integer', { name: 'pluginspace_id', nullable: true })
  pluginspaceId: number | null;

  @Column('timestamp', {
    name: 'trial_created_6',
    nullable: true,
    default: () => 'now()',
  })
  trialCreated_6: Date | null;
}
