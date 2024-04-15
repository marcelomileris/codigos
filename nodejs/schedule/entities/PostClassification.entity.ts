import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Post } from "./Post.entity";

@Index("FK_postcategory_category1_idx", ["classificationId"], {})
@Index("pk_post_classification", ["classificationId", "postId"], {
  unique: true,
})
@Index("FK_postcategory_post1_idx", ["postId"], {})
@Entity("post_classification", { schema: "public" })
export class PostClassification {
  @Column("integer", { primary: true, name: "post_id" })
  postId: number;

  @Column("integer", { primary: true, name: "classification_id" })
  classificationId: number;

  @Column("varchar", { name: "classification_code", length: 40 })
  classificationCode: string;

  @Column("integer", { name: "pluginspace_id" })
  pluginspaceId: number;

  @ManyToOne(() => Post, (post) => post.postClassifications, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "post_id", referencedColumnName: "id" }])
  post: Post;
}
