import { Column, Entity, Index } from "typeorm";

@Index("optional_id", ["optionalId"], {})
@Index("product_id1", ["productId"], {})
@Entity("optional_product", { schema: "public" })
export class OptionalProduct {
  @Column("integer", { name: "optional_id", nullable: true })
  optionalId: number | null;

  @Column("integer", { name: "product_id", nullable: true })
  productId: number | null;
}
