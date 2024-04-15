import { Column, Entity } from "typeorm";

@Entity("decision", { schema: "public" })
export class Decision {
  @Column("text", { name: "btrim", nullable: true })
  btrim: string | null;
}
