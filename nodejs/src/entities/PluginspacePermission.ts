import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("pluginspace_permission_pk", ["id"], { unique: true })
@Entity("pluginspace_permission", { schema: "public" })
export class PluginspacePermission {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("text", { name: "permission " })
  permission: string;
}
