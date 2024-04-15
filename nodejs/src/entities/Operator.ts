import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('pk_operator', ['id'], { unique: true })
@Index('NewTable_un', ['operator', 'tband'], { unique: true })
@Entity('operator', { schema: 'public' })
export class Operator {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('integer', { name: 'tband' })
  tband: number;

  @Column('varchar', { name: 'operator', length: 100 })
  operator: string;

  @Column('timestamp', {
    name: 'created',
    default: () => 'now()',
  })
  created: Date;

  @Column('timestamp', {
    name: 'updated',
    default: () => 'now()',
  })
  updated: Date;

  @Column('boolean', { name: 'removed', default: () => 'false' })
  removed: boolean;
}
