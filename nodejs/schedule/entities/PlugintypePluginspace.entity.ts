import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Pluginspace } from "./Pluginspace.entity";
import { Plugintype } from "./Plugintype.entity";

@Index("pk_id", ["id"], { unique: true })
@Index("FK_plugintypepluginspace_pluginspace1_idx", ["pluginspaceId"], {})
@Index("check_pluginspace_plugintype", ["pluginspaceId", "plugintypeId"], {
  unique: true,
})
@Index("FK_plugintypepluginspace_plugintype1_idx", ["plugintypeId"], {})
@Entity("plugintype_pluginspace", { schema: "public" })
export class PlugintypePluginspace {
  @Column("integer", { name: "plugintypeId", unique: true })
  plugintypeId: number;

  @Column("integer", { name: "pluginspaceId", unique: true })
  pluginspaceId: number;

  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @ManyToOne(
    () => Pluginspace,
    (pluginspace) => pluginspace.plugintypePluginspaces
  )
  @JoinColumn([{ name: "pluginspaceId", referencedColumnName: "id" }])
  pluginspace: Pluginspace;

  @ManyToOne(
    () => Plugintype,
    (plugintype) => plugintype.plugintypePluginspaces
  )
  @JoinColumn([{ name: "plugintypeId", referencedColumnName: "id" }])
  plugintype: Plugintype;
}
