import { Column, Entity, Index } from "typeorm";

@Index("location_id1", ["locationId"], {})
@Index("pk_subcategory_location", ["locationId", "subcategoryId"], {
  unique: true,
})
@Index("subcategory_id", ["subcategoryId"], {})
@Entity("subcategory_location", { schema: "public" })
export class SubcategoryLocation {
  @Column("integer", { primary: true, name: "subcategory_id" })
  subcategoryId: number;

  @Column("integer", { primary: true, name: "location_id" })
  locationId: number;
}
