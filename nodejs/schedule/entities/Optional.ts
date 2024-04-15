import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("pk_optional", ["id"], { unique: true })
@Index("product_id", ["productId"], {})
@Entity("optional", { schema: "public" })
export class Optional {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("varchar", {
    name: "name",
    length: 150,
    default: () => "'0'",
  })
  name: string;

  @Column("varchar", {
    name: "typeoptional",
    nullable: true,
    length: 255,
    default: () => "'acomp'",
  })
  typeoptional: string | null;

  @Column("integer", { name: "product_id", nullable: true })
  productId: number | null;

  @Column("integer", { name: "trial_required_5", nullable: true })
  trialRequired_5: number | null;

  @Column("varchar", { name: "type", nullable: true, length: 255 })
  type: string | null;

  @Column("integer", { name: "max", nullable: true })
  max: number | null;

  @Column("integer", { name: "trial_itemcombo_id_8", nullable: true })
  trialItemcomboId_8: number | null;

  @Column("integer", { name: "order", nullable: true })
  order: number | null;

  @Column("integer", { name: "status", nullable: true })
  status: number | null;
}
