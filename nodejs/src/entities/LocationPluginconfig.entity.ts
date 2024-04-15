import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { Location } from './Location.entity';
import { Pluginconfig } from './Pluginconfig.entity';
import { Plugintype } from './Plugintype.entity';

@Index(
  'pk_location_pluginconfig',
  ['locationId', 'pluginconfigId', 'plugintypeId'],
  { unique: true },
)
@Index('FK_location_pluginconfig_location1_idx', ['locationId'], {})
@Index('FK_location_pluginconfig_pluginconfig1_idx', ['pluginconfigId'], {})
@Entity('location_pluginconfig', { schema: 'public' })
export class LocationPluginconfig {
  @Column('integer', { primary: true, name: 'plugintype_id' })
  plugintypeId: number;

  @Column('integer', { primary: true, name: 'location_id' })
  locationId: number;

  @Column('integer', { primary: true, name: 'pluginconfig_id' })
  pluginconfigId: number;

  @ManyToOne(() => Location, (location) => location.locationPluginconfigs)
  @JoinColumn([{ name: 'location_id', referencedColumnName: 'id' }])
  location: Location;

  @ManyToOne(
    () => Pluginconfig,
    (pluginconfig) => pluginconfig.locationPluginconfigs,
  )
  @JoinColumn([{ name: 'pluginconfig_id', referencedColumnName: 'id' }])
  pluginconfig: Pluginconfig;

  @ManyToOne(() => Plugintype, (plugintype) => plugintype.locationPluginconfigs)
  @JoinColumn([{ name: 'plugintype_id', referencedColumnName: 'id' }])
  plugintype: Plugintype;
}
