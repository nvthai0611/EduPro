import { model, Schema, Types } from "mongoose";



export interface IPostReaction {
  userId: Types.ObjectId;
  postId: Types.ObjectId;
  type: "LIKE" | "SAVE";
  createdAt?: Date;
}
export interface IPostReactionDocument extends IPostReaction {

}
const PostReactionSchema = new Schema<IPostReaction>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    postId: {
      type: Schema.Types.ObjectId,
      ref: "Posts",
      required: true,
    },
    type: {
      type: String,
      enum: ["LIKE", "SAVE"],
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "PostReactions",
  }
);

PostReactionSchema.index(
  { userId: 1, postId: 1, type: 1 },
  { unique: true }
);

PostReactionSchema.index({ postId: 1, type: 1 });
PostReactionSchema.index({ userId: 1, type: 1 });

const PostReactions = model<IPostReactionDocument>(
  "PostReactions",
  PostReactionSchema
);
export default PostReactions;
