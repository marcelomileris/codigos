import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("pk_product_group", ["trialId_1"], { unique: true })
@Entity("product_group", { schema: "public" })
export class ProductGroup {
  @PrimaryGeneratedColumn({ type: "integer", name: "trial_id_1" })
  trialId_1: number;

  @Column("integer", { name: "pluginspace_id" })
  pluginspaceId: number;

  @Column("varchar", { name: "product_group", length: 150 })
  productGroup: string;

  @Column("integer", { name: "weekday" })
  weekday: number;

  @Column("time", {
    name: "time_start",
    default: () => "'00:00:00'",
  })
  timeStart: string;

  @Column("time", {
    name: "trial_time_end_6",
    default: () => "'23:59:00'",
  })
  trialTimeEnd_6: string;

  @Column("smallint", { name: "status", default: () => "1" })
  status: number;
}
