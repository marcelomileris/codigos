import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Analyzeorder } from './Analyzeorder.entity';
import { OdsStatus } from './OdsStatus.entity';
import { Order } from './Order.entity';
import { Orderstatus } from './Orderstatus.entity';
import { Pluginlog } from './Pluginlog.entity';
import { Pluginspace } from './Pluginspace.entity';
import { Plugintype } from './Plugintype.entity';

@Index('pk_status', ['id'], { unique: true })
@Index('FK_status_pluginspace1_idx', ['pluginspaceId'], {})
@Index('fki_fk_status_pluginspace', ['pluginspaceId'], {})
@Index('FK_status_plugintype1_idx', ['plugintypeId'], {})
@Entity('status', { schema: 'public' })
export class Status {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('varchar', { name: 'name', length: 120 })
  name: string;

  @Column('varchar', { name: 'slug', length: 120 })
  slug: string;

  @Column('integer', { name: 'order', nullable: true })
  order: number | null;

  @Column('json', { name: 'colorSetting', nullable: true, default: {} })
  colorSetting: object | null;

  @Column('integer', { name: 'pluginspaceId' })
  pluginspaceId: number;

  @Column('integer', { name: 'plugintypeId' })
  plugintypeId: number;

  @Column('json', { name: 'externalCorrelation', nullable: true, default: {} })
  externalCorrelation: object | null;

  @Column('varchar', {
    name: 'messageStatus',
    nullable: true,
    length: 200,
  })
  messageStatus: string | null;

  @Column('boolean', { name: 'displayStatusWebapp', default: () => 'false' })
  displayStatusWebapp: boolean;

  @Column('boolean', { name: 'activeSms', default: () => 'false' })
  activeSms: boolean;

  @OneToMany(() => Analyzeorder, (analyzeorder) => analyzeorder.status)
  analyzeorders: Analyzeorder[];

  @OneToMany(() => OdsStatus, (odsStatus) => odsStatus.status)
  odsStatuses: OdsStatus[];

  @OneToMany(() => Order, (order) => order.status)
  orders: Order[];

  @OneToMany(() => Orderstatus, (orderstatus) => orderstatus.status2)
  orderstatuses: Orderstatus[];

  @OneToMany(() => Pluginlog, (pluginlog) => pluginlog.status_2)
  pluginlogs: Pluginlog[];

  @ManyToOne(() => Pluginspace, (pluginspace) => pluginspace.statuses)
  @JoinColumn([{ name: 'pluginspaceId', referencedColumnName: 'id' }])
  pluginspace: Pluginspace;

  @ManyToOne(() => Plugintype, (plugintype) => plugintype.statuses)
  @JoinColumn([{ name: 'plugintypeId', referencedColumnName: 'id' }])
  plugintype: Plugintype;
}
