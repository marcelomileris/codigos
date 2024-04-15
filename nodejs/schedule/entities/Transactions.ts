import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('transactions_gateway_fk', ['fkGateway'], {})
@Index('transactions_user_fk', ['fkUser'], {})
@Index('pk_transactions', ['id'], { unique: true })
@Index('transactions_merchant_usn_index', ['merchantUsn'], {})
@Index('pluginconfig_id', ['pluginconfigId'], {})
@Index('pluginspace_id7', ['pluginspaceId'], {})
@Entity('transactions', { schema: 'public' })
export class Transactions {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('integer', { name: 'fk_user' })
  fkUser: number;

  @Column('integer', { name: 'fk_gateway' })
  fkGateway: number;

  @Column('timestamp', {
    name: 'created_at',
    default: () => 'now()',
  })
  createdAt: Date;

  @Column('varchar', { name: 'ip', length: 255 })
  ip: string;

  @Column('text', { name: 'gateway_response', nullable: true })
  gatewayResponse: string | null;

  @Column('varchar', {
    name: 'merchant_usn',
    nullable: true,
    length: 255,
  })
  merchantUsn: string | null;

  @Column('varchar', {
    name: 'esitef_usn',
    nullable: true,
    length: 255,
  })
  esitefUsn: string | null;

  @Column('varchar', {
    name: 'order_id',
    nullable: true,
    length: 255,
  })
  orderId: string | null;

  @Column('varchar', { name: 'status', nullable: true, length: 255 })
  status: string | null;

  @Column('real', { name: 'amount', nullable: true, precision: 24 })
  amount: number | null;

  @Column('integer', { name: 'pluginspace_id', nullable: true })
  pluginspaceId: number | null;

  @Column('integer', { name: 'pluginconfig_id', nullable: true })
  pluginconfigId: number | null;

  @Column('varchar', { name: 'nit', nullable: true, length: 450 })
  nit: string | null;

  @Column('varchar', {
    name: 'networkIdentifier',
    nullable: true,
    length: 100,
  })
  networkIdentifier: string | null;

  @Column('varchar', {
    name: 'binIdentifier',
    nullable: true,
    length: 100,
  })
  binIdentifier: string | null;

  @Column('varchar', {
    name: 'flagIdentifier',
    nullable: true,
    length: 100,
  })
  flagIdentifier: string | null;

  @Column('varchar', {
    name: 'authorization',
    nullable: true,
    length: 100,
  })
  authorization: string | null;

  @Column('varchar', { name: 'NSU', nullable: true, length: 100 })
  nsu: string | null;

  @Column('integer', { name: 'portion_numInstallments', nullable: true })
  portionNumInstallments: number | null;

  @Column('varchar', {
    name: 'descConditionpay',
    nullable: true,
    length: 100,
  })
  descConditionpay: string | null;

  @Column('varchar', {
    name: 'paymentTermCode',
    nullable: true,
    length: 100,
  })
  paymentTermCode: string | null;

  @Column('varchar', {
    name: 'cardnumber',
    nullable: true,
    length: 6,
  })
  cardnumber: string | null;
}
