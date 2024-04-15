import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("pk_svgwebapp", ["id"], { unique: true })
@Entity("svgwebapp", { schema: "public" })
export class Svgwebapp {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("text", { name: "trial_svg_2", nullable: true })
  trialSvg_2: string | null;

  @Column("varchar", {
    name: "trial_description_3",
    nullable: true,
    length: 255,
  })
  trialDescription_3: string | null;
}
