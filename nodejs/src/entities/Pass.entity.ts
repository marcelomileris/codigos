import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Customer } from './Customer.entity';
import { Pluginspace } from './Pluginspace.entity';
import { User } from './User.entity';

@Index('FK_pass_visit1_idx', ['accessId'], {})
@Index('FK_pass_customer1_idx', ['customerId'], {})
@Index('pk_pass', ['id'], { unique: true })
@Index('FK_pass_pluginspace1_idx', ['pluginspaceId'], {})
@Index('FK_pass_user1_idx', ['userId'], {})
@Entity('pass', { schema: 'public' })
export class Pass {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('integer', { name: 'pluginspace_id' })
  pluginspaceId: number;

  @Column('integer', { name: 'access_id' })
  accessId: number;

  @Column('integer', { name: 'customer_id' })
  customerId: number;

  @Column('integer', { name: 'user_id', nullable: true })
  userId: number | null;

  @Column('varchar', {
    name: 'securitylevel',
    length: 255,
    default: () => "'0'",
  })
  securitylevel: string;

  @Column('varchar', {
    name: 'status',
    length: 255,
    default: () => "'open'",
  })
  status: string;

  @Column('text', { name: 'hash', nullable: true })
  hash: string | null;

  @Column('text', { name: 'content', nullable: true })
  content: string | null;

  @Column('text', { name: 'img', nullable: true })
  img: string | null;

  @Column('timestamp', {
    name: 'created',
    nullable: true,
    default: () => 'now()',
  })
  created: Date | null;

  @Column('timestamp', {
    name: 'updated',
    nullable: true,
    default: () => 'now()',
  })
  updated: Date | null;

  @ManyToOne(() => Customer, (customer) => customer.passes)
  @JoinColumn([{ name: 'customer_id', referencedColumnName: 'id' }])
  customer: Customer;

  @ManyToOne(() => Pluginspace, (pluginspace) => pluginspace.passes)
  @JoinColumn([{ name: 'pluginspace_id', referencedColumnName: 'id' }])
  pluginspace: Pluginspace;

  @ManyToOne(() => User, (user) => user.passes)
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;
}
