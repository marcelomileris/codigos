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
import { Plugintype } from './Plugintype.entity';
import { User } from './User.entity';
import { OdsClassification } from './OdsClassification.entity';
import { OdsLocation } from './OdsLocation.entity';
import { OdsStatus } from './OdsStatus.entity';

@Index('pk_ods', ['id'], { unique: true })
@Index('FK_ods_pluginspace1_idx', ['pluginspaceId'], {})
@Index('FK_ods_plugintype1_idx', ['plugintypeId'], {})
@Index('FK_ods_user1_idx', ['userId'], {})
@Entity('ods', { schema: 'public' })
export class Ods {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('varchar', { name: 'name', nullable: true, length: 120 })
  name: string | null;

  @Column('varchar', {
    name: 'soundalert',
    nullable: true,
    length: 120,
    default: () => "'sound-alert2.mp3'",
  })
  soundalert: string | null;

  @Column('enum', { name: 'type', nullable: true, enum: ['block', 'column'] })
  type: 'block' | 'column' | null;

  @Column('integer', { name: 'pluginspaceId' })
  pluginspaceId: number;

  @Column('integer', { name: 'userId', nullable: true })
  userId: number | null;

  @Column('integer', { name: 'plugintypeId' })
  plugintypeId: number;

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

  @Column('integer', { name: 'averagetime', default: () => '0' })
  averagetime: number;

  @Column('boolean', {
    name: 'excluded',
    nullable: true,
    default: () => 'false',
  })
  excluded: boolean | null;

  @Column('integer', { name: 'odsStatusId', nullable: true })
  odsStatusId: number | null;

  @Column('json', { name: 'content', nullable: true, default: {} })
  content: object | null;

  @Column('integer', { name: 'odsClassificationId', nullable: true })
  odsClassificationId: number | null;

  @Column('integer', { name: 'odsLocationId', nullable: true })
  odsLocationId: number | null;

  @ManyToOne(() => Pluginspace, (pluginspace) => pluginspace.ods)
  @JoinColumn([{ name: 'pluginspaceId', referencedColumnName: 'id' }])
  pluginspace: Pluginspace;

  @ManyToOne(() => Plugintype, (plugintype) => plugintype.ods)
  @JoinColumn([{ name: 'plugintypeId', referencedColumnName: 'id' }])
  plugintype: Plugintype;

  @ManyToOne(() => User, (user) => user.ods, { onDelete: 'SET NULL' })
  @JoinColumn([{ name: 'userId', referencedColumnName: 'id' }])
  user: User;

  @OneToMany(
    () => OdsClassification,
    (odsClassification) => odsClassification.ods,
  )
  odsClassifications: OdsClassification[];

  @OneToMany(() => OdsLocation, (odsLocation) => odsLocation.ods)
  odsLocations: OdsLocation[];

  @OneToMany(() => OdsStatus, (odsStatus) => odsStatus.ods)
  odsStatuses: OdsStatus[];
}
