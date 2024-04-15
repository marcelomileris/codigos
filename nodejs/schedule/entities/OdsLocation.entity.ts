import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Location } from './Location.entity';
import { Ods } from './Ods.entity';
import { Pluginspace } from './Pluginspace.entity';

@Entity('ods_location', { schema: 'public' })
export class OdsLocation {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

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

  @ManyToOne(() => Location, (location) => location.odsLocations)
  @JoinColumn([{ name: 'locationId', referencedColumnName: 'id' }])
  location: Location;

  @ManyToOne(() => Ods, (ods) => ods.odsLocations)
  @JoinColumn([{ name: 'odsId', referencedColumnName: 'id' }])
  ods: Ods;

  @ManyToOne(() => Pluginspace, (pluginspace) => pluginspace.odsLocations)
  @JoinColumn([{ name: 'pluginspaceId', referencedColumnName: 'id' }])
  pluginspace: Pluginspace;
}
