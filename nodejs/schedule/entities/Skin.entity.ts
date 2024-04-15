import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Pluginspace } from "./Pluginspace.entity";

@Index("pk_skin", ["id"], { unique: true })
@Entity("skin", { schema: "public" })
export class Skin {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("varchar", { name: "code", length: 20 })
  code: string;

  @Column("varchar", {
    name: "hexadecimal",
    nullable: true,
    length: 120,
  })
  hexadecimal: string | null;

  @OneToMany(() => Pluginspace, (pluginspace) => pluginspace.skin)
  pluginspaces: Pluginspace[];
}
