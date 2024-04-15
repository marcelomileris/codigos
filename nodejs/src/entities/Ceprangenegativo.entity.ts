import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Pluginspace } from './Pluginspace.entity';

@Index('pk_ceprangenegativo', ['id'], { unique: true })
@Entity('ceprangenegativo', { schema: 'public' })
export class Ceprangenegativo {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('integer', { name: 'cepInicio', nullable: true })
  cepInicio: number | null;

  @Column('integer', { name: 'cepFim', nullable: true })
  cepFim: number | null;

  @Column('timestamp', {
    name: 'created',
    nullable: true,
    default: () => 'now()',
  })
  created: Date | null;

  @Column('timestamp', { name: 'updated', nullable: true })
  updated: Date | null;

  @Column('varchar', {
    name: 'userCreated',
    nullable: true,
    length: 50,
  })
  userCreated: string | null;

  @Column('timestamp', { name: 'deleted', nullable: true })
  deleted: Date | null;

  @Column('varchar', {
    name: 'userUpdated',
    nullable: true,
    length: 50,
  })
  userUpdated: string | null;

  @Column('varchar', {
    name: 'userDeleted',
    nullable: true,
    length: 50,
  })
  userDeleted: string | null;

  @Column('smallint', { name: 'removed', nullable: true, default: () => '0' })
  removed: number | null;

  @ManyToOne(() => Pluginspace, (pluginspace) => pluginspace.ceprangenegativos)
  @JoinColumn([{ name: 'pluginspaceId', referencedColumnName: 'id' }])
  pluginspace: Pluginspace;
}
