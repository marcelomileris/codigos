import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PermissionGroup } from './PermissionGroup.entity';
import { Page } from './Page.entity';
import { Pluginspace } from './Pluginspace.entity';

@Index('FK_permission_page_page1_idx', ['pageId'], {})
@Index('FK_permission_page_pluginspace1_idx', ['pluginspaceId'], {})
@Entity('permissionPage', { schema: 'public' })
export class PermissionPage {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('integer', { name: 'pageId' })
  pageId: number;

  @Column('integer', { name: 'pluginspaceId' })
  pluginspaceId: number;

  @ManyToOne(
    () => PermissionGroup,
    (permissionGroup) => permissionGroup.permissionPages,
  )
  @JoinColumn([{ name: 'groupId', referencedColumnName: 'id' }])
  group: PermissionGroup;

  @ManyToOne(() => Page, (page) => page.permissionPages)
  @JoinColumn([{ name: 'pageId', referencedColumnName: 'id' }])
  page: Page;

  @ManyToOne(() => Pluginspace, (pluginspace) => pluginspace.permissionPages)
  @JoinColumn([{ name: 'pluginspaceId', referencedColumnName: 'id' }])
  pluginspace: Pluginspace;
}
