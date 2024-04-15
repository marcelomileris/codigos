import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Pluginspace } from './Pluginspace.entity';
import { CustomerAddress } from './CustomerAddress.entity';
import { CustomerPhones } from './CustomerPhones.entity';
import { Multichannel } from './Multichannel.entity';
import { Order } from './Order.entity';
import { Pass } from './Pass.entity';
import { ProductComments } from './ProductComments.entity';
import { ProductFavorite } from './ProductFavorite.entity';
import { ProductInterest } from './ProductInterest.entity';

@Index('pk_customer', ['id'], { unique: true })
@Index('FK_customer_pluginspace', ['pluginspaceId'], {})
@Entity('customer', { schema: 'public' })
export class Customer {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('varchar', { name: 'name', length: 255 })
  name: string;

  @Column('varchar', { name: 'email', nullable: true, length: 250 })
  email: string | null;

  @Column('varchar', { name: 'doc', nullable: true, length: 250 })
  doc: string | null;

  @Column('varchar', {
    name: 'password',
    nullable: true,
    length: 128,
  })
  password: string | null;

  @Column('integer', { name: 'pluginspaceId', default: () => '0' })
  pluginspaceId: number;

  @Column('text', { name: 'hash', nullable: true })
  hash: string | null;

  @Column('varchar', {
    name: 'type',
    length: 255,
    default: () => "'temp'",
  })
  type: string;

  @Column('timestamp', {
    name: 'created',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  created: Date | null;

  @Column('timestamp', {
    name: 'updated',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  updated: Date | null;

  @Column('varchar', {
    name: 'cpf',
    nullable: true,
    length: 20,
    default: () => "'0'",
  })
  cpf: string | null;

  @Column('date', { name: 'birthDate', nullable: true })
  birthDate: string | null;

  @Column('varchar', { name: 'gender', nullable: true, length: 50 })
  gender: string | null;

  @Column('timestamp', {
    name: 'lgpdDataAceiteCarta',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  lgpdDataAceiteCarta: Date | null;

  @Column('integer', { name: 'customerCode', nullable: true })
  customerCode: number | null;

  @Column('integer', { name: 'idTerms', nullable: true })
  idTerms: number | null;

  @Column('timestamp', { name: 'deleted', nullable: true })
  deleted: Date | null;

  @Column('boolean', { name: 'optinWhatsapp', default: () => 'false' })
  optinWhatsapp: boolean;

  @ManyToOne(() => Pluginspace, (pluginspace) => pluginspace.customers, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'pluginspaceId', referencedColumnName: 'id' }])
  pluginspace: Pluginspace;

  @OneToMany(
    () => CustomerAddress,
    (customerAddress) => customerAddress.customer,
  )
  customerAddresses: CustomerAddress[];

  @OneToMany(() => CustomerPhones, (customerPhones) => customerPhones.customer)
  customerPhones: CustomerPhones[];

  @OneToMany(() => Multichannel, (multichannel) => multichannel.customer)
  multichannels: Multichannel[];

  @OneToMany(() => Multichannel, (multichannel) => multichannel.customer2)
  multichannels2: Multichannel[];

  @OneToMany(() => Order, (order) => order.customer)
  orders: Order[];

  @OneToMany(() => Pass, (pass) => pass.customer)
  passes: Pass[];

  @OneToMany(
    () => ProductComments,
    (productComments) => productComments.customer,
  )
  productComments: ProductComments[];

  @OneToMany(
    () => ProductFavorite,
    (productFavorite) => productFavorite.customer,
  )
  productFavorites: ProductFavorite[];

  @OneToMany(
    () => ProductInterest,
    (productInterest) => productInterest.customer,
  )
  productInterests: ProductInterest[];
}
