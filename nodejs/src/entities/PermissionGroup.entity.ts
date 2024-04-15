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
import { User } from './User.entity';
import { PermissionPage } from './PermissionPage.entity';
import { UserGroupLocation } from './UserGroupLocation.entity';

@Index('pk_permissiongroup', ['id'], { unique: true })
@Index('pluginspace_id3', ['pluginspaceId'], {})
@Index('FK_permissiongroup_user', ['userId'], {})
@Entity('permissionGroup', { schema: 'public' })
export class PermissionGroup {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('integer', { name: 'pluginspaceId' })
  pluginspaceId: number;

  @Column('integer', { name: 'userId', nullable: true })
  userId: number | null;

  @Column('smallint', { name: 'allowDelete', default: () => '1' })
  allowDelete: number;

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

  @Column('timestamp', { name: 'deleted', nullable: true })
  deleted: Date | null;

  @Column('varchar', { name: 'name', length: 45 })
  name: string;

  @ManyToOne(() => Pluginspace, (pluginspace) => pluginspace.permissionGroups, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'pluginspaceId', referencedColumnName: 'id' }])
  pluginspace: Pluginspace;

  @ManyToOne(() => User, (user) => user.permissionGroups, {
    onDelete: 'SET NULL',
    onUpdate: 'SET NULL',
  })
  @JoinColumn([{ name: 'userId', referencedColumnName: 'id' }])
  user2: User;

  @OneToMany(() => PermissionPage, (permissionPage) => permissionPage.group)
  permissionPages: PermissionPage[];

  @OneToMany(() => User, (user) => user.permissionGroup)
  users: User[];

  @OneToMany(
    () => UserGroupLocation,
    (userGroupLocation) => userGroupLocation.group,
  )
  userGroupLocations: UserGroupLocation[];
}
