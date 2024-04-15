import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('pk_payment', ['trialId_1'], { unique: true })
@Entity('payment', { schema: 'public' })
export class Payment {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'trial_id_1' })
  trialId_1: number;

  @Column('integer', { name: 'transaction', nullable: true })
  transaction: number | null;

  @Column('varchar', { name: 'type', nullable: true, length: 20 })
  type: string | null;

  @Column('varchar', { name: 'status', nullable: true, length: 20 })
  status: string | null;

  @Column('varchar', { name: 'store', nullable: true, length: 45 })
  store: string | null;

  @Column('integer', { name: 'order_id', nullable: true })
  orderId: number | null;

  @Column('numeric', { name: 'value', nullable: true, precision: 10, scale: 2 })
  value: string | null;

  @Column('timestamp', { name: 'date', nullable: true })
  date: Date | null;

  @Column('timestamp', {
    name: 'effective_date',
    nullable: true,
  })
  effectiveDate: Date | null;

  @Column('timestamp', {
    name: 'confirmation_date',
    nullable: true,
  })
  confirmationDate: Date | null;

  @Column('integer', { name: 'trial_sitef_response_code_11', nullable: true })
  trialSitefResponseCode_11: number | null;

  @Column('integer', { name: 'store_nsu', nullable: true })
  storeNsu: number | null;

  @Column('varchar', {
    name: 'trial_installments_13',
    nullable: true,
    length: 45,
  })
  trialInstallments_13: string | null;

  @Column('integer', { name: 'store_warning_failures', nullable: true })
  storeWarningFailures: number | null;

  @Column('varchar', {
    name: 'trial_client_ip_15',
    nullable: true,
    length: 45,
  })
  trialClientIp_15: string | null;

  @Column('varchar', {
    name: 'trial_authorized_16',
    nullable: true,
    length: 45,
  })
  trialAuthorized_16: string | null;

  @Column('varchar', {
    name: 'trial_message_17',
    nullable: true,
    length: 45,
  })
  trialMessage_17: string | null;

  @Column('integer', { name: 'trial_authorization_18', nullable: true })
  trialAuthorization_18: number | null;

  @Column('varchar', {
    name: 'trial_financing_19',
    nullable: true,
    length: 45,
  })
  trialFinancing_19: string | null;

  @Column('varchar', { name: 'flag', nullable: true, length: 45 })
  flag: string | null;

  @Column('varchar', {
    name: 'payment_type',
    nullable: true,
    length: 45,
  })
  paymentType: string | null;

  @Column('integer', { name: 'trial_sitef_nsu_22', nullable: true })
  trialSitefNsu_22: number | null;

  @Column('varchar', { name: 'tid', nullable: true, length: 45 })
  tid: string | null;

  @Column('varchar', {
    name: 'transaction_style',
    nullable: true,
    length: 45,
  })
  transactionStyle: string | null;

  @Column('integer', { name: 'host_nsu', nullable: true })
  hostNsu: number | null;

  @Column('varchar', {
    name: 'trial_eci_26',
    nullable: true,
    length: 45,
  })
  trialEci_26: string | null;

  @Column('integer', { name: 'trial_store_warning_attemps_27', nullable: true })
  trialStoreWarningAttemps_27: number | null;

  @Column('varchar', { name: 'document', nullable: true, length: 45 })
  document: string | null;
}
