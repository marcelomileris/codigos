import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Customer } from './Customer.entity';

@Index('fk_multichannel_customer', ['customerId'], {})
@Index('pk_multichannel', ['id'], { unique: true })
@Entity('multichannel', { schema: 'public' })
export class Multichannel {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('varchar', {
    name: 'phoneNumber',
    nullable: true,
    length: 50,
  })
  phoneNumber: string | null;

  @Column('integer', { name: 'pluginspaceId', nullable: true })
  pluginspaceId: number | null;

  @Column('integer', { name: 'customerId' })
  customerId: number;

  @Column('timestamp', {
    name: 'dateCreated',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  dateCreated: Date | null;

  @Column('timestamp', {
    name: 'dataUpdated',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  dataUpdated: Date | null;

  @Column('timestamp', {
    name: 'dataDeleted',
    nullable: true,
  })
  dataDeleted: Date | null;

  @Column('varchar', {
    name: 'userCreated',
    nullable: true,
    length: 50,
  })
  userCreated: string | null;

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

  @Column('boolean', { name: 'status', nullable: true, default: () => 'true' })
  status: boolean | null;

  @Column('boolean', { name: 'sms', default: () => 'false' })
  sms: boolean;

  @Column('boolean', { name: 'email', default: () => 'false' })
  email: boolean;

  @Column('boolean', { name: 'instagram', default: () => 'false' })
  instagram: boolean;

  @Column('boolean', { name: 'telegram', default: () => 'false' })
  telegram: boolean;

  @Column('boolean', { name: 'whatsapp', default: () => 'false' })
  whatsapp: boolean;

  @Column('boolean', { name: 'messenger', default: () => 'false' })
  messenger: boolean;

  @Column('boolean', { name: 'facebook', default: () => 'false' })
  facebook: boolean;

  @ManyToOne(() => Customer, (customer) => customer.multichannels, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'customerId', referencedColumnName: 'id' }])
  customer: Customer;

  @ManyToOne(() => Customer, (customer) => customer.multichannels2, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'customerId', referencedColumnName: 'id' }])
  customer2: Customer;
}
