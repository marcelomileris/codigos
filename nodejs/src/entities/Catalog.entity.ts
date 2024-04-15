import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Pluginspace } from './Pluginspace.entity';

@Index('pk_catalog', ['id'], { unique: true })
@Entity('catalog', { schema: 'public' })
export class Catalog {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('integer', { name: 'userId', nullable: true })
  userId: number | null;

  @Column('varchar', { name: 'catalog', length: 150 })
  catalog: string;

  @Column('smallint', { name: 'status', nullable: true, default: () => '1' })
  status: number | null;

  @Column('varchar', {
    name: 'imgCatalog',
    nullable: true,
    length: 255,
  })
  imgCatalog: string | null;

  @Column('timestamp', {
    name: 'dateStart',
    default: () => 'CURRENT_TIMESTAMP',
  })
  dateStart: Date;

  @Column('timestamp', { name: 'dateEnd' })
  dateEnd: Date;

  @Column('timestamp', {
    name: 'created',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  created: Date | null;

  @Column('timestamp', { name: 'deleted', nullable: true })
  deleted: Date | null;

  @Column('integer', { name: 'order', nullable: true })
  order: number | null;

  @Column('timestamp', {
    name: 'updated',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updated: Date;

  @ManyToOne(() => Pluginspace, (pluginspace) => pluginspace.catalogs)
  @JoinColumn([{ name: 'pluginspaceId', referencedColumnName: 'id' }])
  pluginspace: Pluginspace;
}
