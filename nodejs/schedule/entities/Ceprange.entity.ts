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

@Index('pk_ceprange', ['id'], { unique: true })
@Entity('ceprange', { schema: 'public' })
export class Ceprange {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('integer', { name: 'zipStart' })
  zipStart: number;

  @Column('integer', { name: 'zipEnd' })
  zipEnd: number;

  @Column('real', { name: 'price', precision: 24 })
  price: number;

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

  @Column('timestamp', { name: 'deleted', nullable: true })
  deleted: Date | null;

  @Column('boolean', { name: 'negativeRange', default: () => 'true' })
  negativeRange: boolean;

  @ManyToOne(() => Pluginspace, (pluginspace) => pluginspace.cepranges)
  @JoinColumn([{ name: 'pluginspaceId', referencedColumnName: 'id' }])
  pluginspace: Pluginspace;

  @ManyToOne(() => User, (user) => user.cepranges)
  @JoinColumn([{ name: 'userCreated', referencedColumnName: 'id' }])
  userCreated: User;

  @ManyToOne(() => User, (user) => user.cepranges2)
  @JoinColumn([{ name: 'userDeleted', referencedColumnName: 'id' }])
  userDeleted: User;

  @ManyToOne(() => User, (user) => user.cepranges3)
  @JoinColumn([{ name: 'userUpdated', referencedColumnName: 'id' }])
  userUpdated: User;
}
