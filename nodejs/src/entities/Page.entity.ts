import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PermissionPage } from './PermissionPage.entity';

@Index('pk_page', ['id'], { unique: true })
@Entity('page', { schema: 'public' })
export class Page {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('varchar', { name: 'name', nullable: true, length: 120 })
  name: string | null;

  @Column('varchar', { name: 'icon', nullable: true, length: 120 })
  icon: string | null;

  @Column('varchar', { name: 'route', nullable: true, length: 120 })
  route: string | null;

  @Column('integer', { name: 'menu', nullable: true })
  menu: number | null;

  @Column('integer', { name: 'parent', nullable: true })
  parent: number | null;

  @Column('integer', { name: 'order', nullable: true })
  order: number | null;

  @Column('varchar', { name: 'type', nullable: true, length: 255 })
  type: string | null;

  @Column('text', { name: 'newIcon', nullable: true })
  newIcon: string | null;

  @OneToMany(() => PermissionPage, (permissionPage) => permissionPage.page)
  permissionPages: PermissionPage[];
}
