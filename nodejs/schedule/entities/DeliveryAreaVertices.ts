import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("deliveryAreaVertices_pkey", ["id"], { unique: true })
@Entity("deliveryAreaVertices", { schema: "public" })
export class DeliveryAreaVertices {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id: string;

  @Column("json", { name: "vertices" })
  vertices: object;

  @Column("integer", { name: "deliveryAreaId" })
  deliveryAreaId: number;
}
