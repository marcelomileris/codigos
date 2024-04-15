import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Pluginspace } from './Pluginspace.entity';

@Index('id', ['id'], { unique: true })
@Index('unique_pluginspace', ['pluginspaceId'], { unique: true })
@Entity('keyPair', { schema: 'public' })
export class KeyPair {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('integer', { name: 'pluginspaceId', unique: true })
  pluginspaceId: number;

  @Column('text', { name: 'publicKey' })
  publicKey: string;

  @Column('text', { name: 'privateKey' })
  privateKey: string;

  @Column('timestamp', {
    name: 'created',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created: Date;

  @Column('timestamp', {
    name: 'updated',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updated: Date;

  @OneToOne(() => Pluginspace, (pluginspace) => pluginspace.keyPair)
  @JoinColumn([{ name: 'pluginspaceId', referencedColumnName: 'id' }])
  pluginspace: Pluginspace;
}
