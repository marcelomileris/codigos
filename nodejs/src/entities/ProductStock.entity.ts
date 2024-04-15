import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Product } from "./Product.entity";

@Index("pk_product_stock", ["id"], { unique: true })
@Index(
  "product_stock_pluginspace_fk_product_id_IDX",
  ["pluginspaceId", "productCode", "productId"],
  {}
)
@Index("product_stock_pluginspace_id_IDX", ["pluginspaceId", "productId"], {})
@Index(
  "unique_product_id_code_pluguin_space",
  ["pluginspaceId", "productCode", "productId"],
  { unique: true }
)
@Index("product_stock_UN1", ["productCode", "productId", "storeCode"], {
  unique: true,
})
@Index("Product_stock_FK", ["productId"], {})
@Entity("product_stock", { schema: "public" })
export class ProductStock {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "productId", unique: true })
  productId: number;

  @Column("varchar", {
    name: "productCode",
    unique: true,
    length: 120,
  })
  productCode: string;

  @Column("varchar", { name: "storeCode", length: 120 })
  storeCode: string;

  @Column("varchar", { name: "parentStoreCode", length: 120 })
  parentStoreCode: string;

  @Column("bigint", { name: "inventory", default: () => "0" })
  inventory: string;

  @Column("bigint", {
    name: "minimumStock",
    nullable: true,
    default: () => "0",
  })
  minimumStock: string | null;

  @Column("integer", {
    name: "classificationId",
    nullable: true,
    default: () => "0",
  })
  classificationId: number | null;

  @Column("integer", { name: "pluginspaceId", nullable: true, unique: true })
  pluginspaceId: number | null;

  @ManyToOne(() => Product, (product) => product.productStocks)
  @JoinColumn([{ name: "productId", referencedColumnName: "id" }])
  product: Product;
}
