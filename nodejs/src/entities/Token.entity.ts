import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Pluginspace } from './Pluginspace.entity';

@Index('pk_token', ['id'], { unique: true })
@Index('FK_token_pluginspace1_idx', ['pluginspaceId'], {})
@Entity('token', { schema: 'public' })
export class Token {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('integer', { name: 'pluginspaceId', nullable: true })
  pluginspaceId: number | null;

  @Column('varchar', { name: 'type', nullable: true, length: 255 })
  type: string | null;

  @Column('integer', { name: 'bearerId', nullable: true })
  bearerId: number | null;

  @Column('text', { name: 'token' })
  token: string;

  @Column('text', { name: 'refreshToken' })
  refreshToken: string;

  @Column('smallint', { name: 'valid', nullable: true, default: () => '0' })
  valid: number | null;

  @Column('timestamp', { name: 'expiredAt' })
  expiredAt: Date;

  @Column('timestamp', {
    name: 'created',
    nullable: true,
    default: () => 'now()',
  })
  created: Date | null;

  @ManyToOne(() => Pluginspace, (pluginspace) => pluginspace.tokens)
  @JoinColumn([{ name: 'pluginspaceId', referencedColumnName: 'id' }])
  pluginspace: Pluginspace;
}
