import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Pluginspace } from './Pluginspace.entity';
import { User } from './User.entity';

@Index('pk_terms', ['id'], { unique: true })
@Index('FK_terms_pluginspace_idx', ['pluginspaceId'], {})
@Index('FK_terms_user_idx', ['userId'], {})
@Entity('terms', { schema: 'public' })
export class Terms {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('varchar', { name: 'name', length: 100 })
  name: string;

  @Column('text', { name: 'content' })
  content: string;

  @Column('boolean', { name: 'active' })
  active: boolean;

  @Column('integer', { name: 'pluginspaceId' })
  pluginspaceId: number;

  @Column('integer', { name: 'userId' })
  userId: number;

  @Column('timestamp', {
    name: 'created',
    default: () => 'now()',
  })
  created: Date;

  @Column('timestamp', {
    name: 'expirated',
    default: () => 'now()',
  })
  expirated: Date;

  @ManyToOne(() => Pluginspace, (pluginspace) => pluginspace.terms2, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'pluginspaceId', referencedColumnName: 'id' }])
  pluginspace: Pluginspace;

  @ManyToOne(() => User, (user) => user.terms, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'userId', referencedColumnName: 'id' }])
  user: User;
}
