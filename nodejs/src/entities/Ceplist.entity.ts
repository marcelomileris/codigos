import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Pluginspace } from "./Pluginspace.entity";

@Index("pk_ceplist", ["id"], { unique: true })
@Index("pluginspace_id1", ["pluginspaceId"], {})
@Entity("ceplist", { schema: "public" })
export class Ceplist {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("json", { name: "value", nullable: true, default: {} })
  value: object | null;

  @Column("json", { name: "negativeValue", nullable: true, default: {} })
  negativeValue: object | null;

  @Column("bigint", { name: "pluginspaceId", default: () => "0" })
  pluginspaceId: string;

  @ManyToOne(() => Pluginspace, (pluginspace) => pluginspace.ceplists)
  @JoinColumn([{ name: "pluginspaceId", referencedColumnName: "id" }])
  pluginspace: Pluginspace;
}
