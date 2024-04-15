import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Pluginspace } from './Pluginspace.entity';

@Index('pk_envelope_confimation', ['id'], { unique: true })
@Index('fki_envelope_confimation_FK', ['pluginspaceId'], {})
@Entity('envelope_confimation', { schema: 'public' })
export class EnvelopeConfimation {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('varchar', { name: 'ticket', length: 100 })
  ticket: string;

  @Column('integer', { name: 'store' })
  store: number;

  @Column('date', { name: 'date_ticket' })
  dateTicket: string;

  @Column('time', { name: 'time_ticket' })
  timeTicket: string;

  @Column('varchar', {
    name: 'confirmation',
    length: 100,
    default: () => "'not confirmed'",
  })
  confirmation: string;

  @Column('integer', { name: 'quantity_products', default: () => '0' })
  quantityProducts: number;

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

  @Column('integer', { name: 'pluginspace_id' })
  pluginspaceId: number;

  @ManyToOne(
    () => Pluginspace,
    (pluginspace) => pluginspace.envelopeConfimations,
  )
  @JoinColumn([{ name: 'pluginspace_id', referencedColumnName: 'id' }])
  pluginspace: Pluginspace;
}
