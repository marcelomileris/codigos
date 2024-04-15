import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Classification } from './Classification.entity';
import { Grid } from './Grid.entity';
import { LocationPluginconfig } from './LocationPluginconfig.entity';
import { Mark } from './Mark.entity';
import { Ods } from './Ods.entity';
import { Order } from './Order.entity';
import { Pluginconfig } from './Pluginconfig.entity';
import { Pluginlog } from './Pluginlog.entity';
import { Pluginmessage } from './Pluginmessage.entity';
import { Plugintemplate } from './Plugintemplate.entity';
import { PlugintypePluginspace } from './PlugintypePluginspace.entity';
import { Status } from './Status.entity';

@Index('pk_plugintype', ['id'], { unique: true })
@Entity('plugintype', { schema: 'public' })
export class Plugintype {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('varchar', { name: 'name', nullable: true, length: 120 })
  name: string | null;

  @Column('text', { name: 'icon', nullable: true })
  icon: string | null;

  @Column('smallint', { name: 'display', nullable: true })
  display: number | null;

  @Column('text', { name: 'content', nullable: true })
  content: string | null;

  @Column('real', { name: 'price', nullable: true, precision: 24 })
  price: number | null;

  @Column('varchar', { name: 'route', nullable: true, length: 250 })
  route: string | null;

  @OneToMany(
    () => Classification,
    (classification) => classification.plugintype,
  )
  classifications: Classification[];

  @OneToMany(() => Grid, (grid) => grid.plugintype)
  grs: Grid[];

  @OneToMany(
    () => LocationPluginconfig,
    (locationPluginconfig) => locationPluginconfig.plugintype,
  )
  locationPluginconfigs: LocationPluginconfig[];

  @OneToMany(() => Mark, (mark) => mark.plugintype)
  marks: Mark[];

  @OneToMany(() => Ods, (ods) => ods.plugintype)
  ods: Ods[];

  @OneToMany(() => Order, (order) => order.plugintype)
  orders: Order[];

  @OneToMany(() => Pluginconfig, (pluginconfig) => pluginconfig.plugintype)
  pluginconfigs: Pluginconfig[];

  @OneToMany(() => Pluginlog, (pluginlog) => pluginlog.plugintype)
  pluginlogs: Pluginlog[];

  @OneToMany(() => Pluginmessage, (pluginmessage) => pluginmessage.plugintype)
  pluginmessages: Pluginmessage[];

  @OneToMany(
    () => Plugintemplate,
    (plugintemplate) => plugintemplate.plugintype,
  )
  plugintemplates: Plugintemplate[];

  @OneToMany(
    () => PlugintypePluginspace,
    (plugintypePluginspace) => plugintypePluginspace.plugintype,
  )
  plugintypePluginspaces: PlugintypePluginspace[];

  @OneToMany(() => Status, (status) => status.plugintype)
  statuses: Status[];
}
