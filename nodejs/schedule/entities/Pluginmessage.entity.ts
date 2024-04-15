import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Pluginspace } from './Pluginspace.entity';
import { Plugintype } from './Plugintype.entity';

@Index('pk_pluginmessage', ['id'], { unique: true })
@Index('FK_pluginmessage_pluginspace1_idx', ['pluginspaceId'], {})
@Index('FK_pluginmessage_plugintype1_idx', ['plugintypeId'], {})
@Entity('pluginmessage', { schema: 'public' })
export class Pluginmessage {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('integer', { name: 'pluginspace_id' })
  pluginspaceId: number;

  @Column('integer', { name: 'plugintype_id' })
  plugintypeId: number;

  @Column('varchar', { name: 'creator_type', length: 255 })
  creatorType: string;

  @Column('integer', { name: 'creator_id', nullable: true })
  creatorId: number | null;

  @Column('integer', { name: 'object_id' })
  objectId: number;

  @Column('text', { name: 'trial_content_7', nullable: true })
  trialContent_7: string | null;

  @Column('timestamp', {
    name: 'created',
    nullable: true,
    default: () => 'now()',
  })
  created: Date | null;

  @ManyToOne(() => Pluginspace, (pluginspace) => pluginspace.pluginmessages)
  @JoinColumn([{ name: 'pluginspace_id', referencedColumnName: 'id' }])
  pluginspace: Pluginspace;

  @ManyToOne(() => Plugintype, (plugintype) => plugintype.pluginmessages)
  @JoinColumn([{ name: 'plugintype_id', referencedColumnName: 'id' }])
  plugintype: Plugintype;
}
