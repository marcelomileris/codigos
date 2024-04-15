import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { PermissionGroup } from "./PermissionGroup.entity";
import { Location } from "./Location.entity";
import { User } from "./User.entity";

@Index("FK_user_group_group1_idx", ["groupId"], {})
@Index("pk_user_group_location", ["groupId", "locationId", "userId"], {
  unique: true,
})
@Index("FK_user_group_location_location1_idx", ["locationId"], {})
@Index("FK_user_group_user1_idx", ["userId"], {})
@Entity("userGroupLocation", { schema: "public" })
export class UserGroupLocation {
  @Column("integer", { primary: true, name: "userId" })
  userId: number;

  @Column("integer", { primary: true, name: "groupId" })
  groupId: number;

  @Column("integer", { primary: true, name: "locationId" })
  locationId: number;

  @ManyToOne(
    () => PermissionGroup,
    (permissionGroup) => permissionGroup.userGroupLocations
  )
  @JoinColumn([{ name: "groupId", referencedColumnName: "id" }])
  group: PermissionGroup;

  @ManyToOne(() => Location, (location) => location.userGroupLocations)
  @JoinColumn([{ name: "locationId", referencedColumnName: "id" }])
  location: Location;

  @ManyToOne(() => User, (user) => user.userGroupLocations)
  @JoinColumn([{ name: "userId", referencedColumnName: "id" }])
  user: User;
}
