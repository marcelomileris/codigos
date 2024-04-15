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
import { PostClassification } from './PostClassification.entity';

@Index('pk_post', ['id'], { unique: true })
@Index('FK_post_pluginspace1_idx', ['pluginspaceId'], {})
@Index('FK_post_user1_idx', ['userId'], {})
@Entity('post', { schema: 'public' })
export class Post {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('varchar', { name: 'title', nullable: true, length: 250 })
  title: string | null;

  @Column('varchar', { name: 'summary', nullable: true, length: 420 })
  summary: string | null;

  @Column('text', { name: 'content', nullable: true })
  content: string | null;

  @Column('text', { name: 'contentEn', nullable: true })
  contentEn: string | null;

  @Column('text', { name: 'contentEs', nullable: true })
  contentEs: string | null;

  @Column('varchar', { name: 'path', nullable: true, length: 120 })
  path: string | null;

  @Column('text', { name: 'img', nullable: true })
  img: string | null;

  @Column('integer', { name: 'views', nullable: true })
  views: number | null;

  @Column('integer', { name: 'pluginspace_id' })
  pluginspaceId: number;

  @Column('integer', { name: 'user_id' })
  userId: number;

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

  @Column('timestamp', { name: 'deleted', nullable: true })
  deleted: Date | null;

  @Column('varchar', { name: 'phone', nullable: true, length: 120 })
  phone: string | null;

  @Column('varchar', { name: 'email', nullable: true, length: 120 })
  email: string | null;

  @Column('varchar', { name: 'contact', nullable: true, length: 120 })
  contact: string | null;

  @ManyToOne(() => Pluginspace, (pluginspace) => pluginspace.posts)
  @JoinColumn([{ name: 'pluginspace_id', referencedColumnName: 'id' }])
  pluginspace: Pluginspace;

  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;

  @OneToMany(
    () => PostClassification,
    (postClassification) => postClassification.post,
  )
  postClassifications: PostClassification[];
}
