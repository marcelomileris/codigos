import { Column, Entity, Index } from 'typeorm';

@Index('FK_product_aggregation_subcategory1_idx', ['classificationId'], {})
@Index('FK_product_aggregation_product1_idx', ['productId'], {})
@Index('FK_product_aggregation_user1_idx', ['userId'], {})
@Entity('product_aggregation', { schema: 'public' })
export class ProductAggregation {
  @Column('integer', { name: 'productId', nullable: true })
  productId: number | null;

  @Column('integer', { name: 'classificationId', nullable: true })
  classificationId: number | null;

  @Column('integer', { name: 'userId', nullable: true })
  userId: number | null;

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
}
