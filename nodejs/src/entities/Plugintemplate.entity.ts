import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Pluginconfig } from "./Pluginconfig.entity";
import { Plugintype } from "./Plugintype.entity";

@Index("pk_plugintemplate", ["id"], { unique: true })
@Index("FK_plugintemplate_plugintype1_idx", ["plugintypeId"], {})
@Entity("plugintemplate", { schema: "public" })
export class Plugintemplate {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "plugintypeId" })
  plugintypeId: number;

  @Column("varchar", { name: "name", nullable: true, length: 120 })
  name: string | null;

  @Column("text", { name: "parameters", nullable: true })
  parameters: string | null;

  @OneToMany(() => Pluginconfig, (pluginconfig) => pluginconfig.plugintemplate)
  pluginconfigs: Pluginconfig[];

  @ManyToOne(() => Plugintype, (plugintype) => plugintype.plugintemplates)
  @JoinColumn([{ name: "plugintypeId", referencedColumnName: "id" }])
  plugintype: Plugintype;
}
