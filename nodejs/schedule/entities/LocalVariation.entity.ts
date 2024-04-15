import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { Location } from './Location.entity';
import { Variation } from './Variation.entity';

@Index('FK_locationvariation_location1_idx', ['locationId'], {})
@Index('pk_local_variation', ['locationId', 'productId'], { unique: true })
@Index('FK_locationvariation_variation1_idx', ['productId'], {})
@Entity('local_variation', { schema: 'public' })
export class LocalVariation {
  @Column('integer', { primary: true, name: 'locationId' })
  locationId: number;

  @Column('integer', { primary: true, name: 'productId' })
  productId: number;

  @Column('real', { name: 'price', nullable: true, precision: 24 })
  price: number | null;

  @Column('integer', { name: 'status', nullable: true })
  status: number | null;

  @Column('timestamp', {
    name: 'updated',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  updated: Date | null;

  @Column('integer', { name: 'pluginspaceId', nullable: true })
  pluginspaceId: number | null;

  @Column('real', {
    name: 'costPrice',
    nullable: true,
    precision: 24,
    default: () => '0',
  })
  costPrice: number | null;

  @Column('real', {
    name: 'promotionalPrice',
    nullable: true,
    precision: 24,
    default: () => '0',
  })
  promotionalPrice: number | null;

  @Column('timestamp', {
    name: 'created',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  created: Date | null;

  @Column('timestamp', { name: 'deleted', nullable: true })
  deleted: Date | null;

  @ManyToOne(() => Location, (location) => location.localVariations, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'locationId', referencedColumnName: 'id' }])
  location: Location;

  @ManyToOne(() => Variation, (variation) => variation.localVariations, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'productId', referencedColumnName: 'id' }])
  product: Variation;
}
