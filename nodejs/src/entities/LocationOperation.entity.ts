import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("pk_location_operation", ["id"], { unique: true })
@Index("FK_location_operation_location_idx", ["locationId"], {})
@Index("FK_location_operation_pluginspace_idx", ["pluginspaceId"], {})
@Entity("locationOperation", { schema: "public" })
export class LocationOperation {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "locationId" })
  locationId: number;

  @Column("integer", { name: "pluginspaceId" })
  pluginspaceId: number;

  @Column("integer", { name: "weekday" })
  weekday: number;

  @Column("time", { name: "timeStart" })
  timeStart: string;

  @Column("time", { name: "timeEnd" })
  timeEnd: string;

  @Column("time", { name: "timeStart2" })
  timeStart2: string;

  @Column("time", { name: "timeEnd2" })
  timeEnd2: string;

  @Column("varchar", {
    name: "closetime",
    nullable: true,
    length: 50,
  })
  closetime: string | null;
}
