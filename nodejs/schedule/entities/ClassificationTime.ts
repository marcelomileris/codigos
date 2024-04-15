import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("classification_time_id_pk", ["id"], { unique: true })
@Entity("classification_time", { schema: "public" })
export class ClassificationTime {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id: string;

  @Column("bigint", { name: "classificador_id" })
  classificadorId: string;

  @Column("time", {
    name: "time_start",
    default: () => "'00:00:00'",
  })
  timeStart: string;

  @Column("time", {
    name: "time_end",
    default: () => "'23:59:59'",
  })
  timeEnd: string;
}
