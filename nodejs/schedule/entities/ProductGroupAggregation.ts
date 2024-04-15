import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("pk_product_group_aggregation", ["id"], { unique: true })
@Index("FK__pluginspace", ["pluginspaceId"], {})
@Index("FK__product_group", ["productGroupId"], {})
@Index("FK__product", ["productId"], {})
@Entity("product_group_aggregation", { schema: "public" })
export class ProductGroupAggregation {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "pluginspaceId" })
  pluginspaceId: number;

  @Column("integer", { name: "productGroupId" })
  productGroupId: number;

  @Column("integer", { name: "productId" })
  productId: number;
}
