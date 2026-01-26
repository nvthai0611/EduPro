import { model, Schema, Types } from "mongoose";

export interface IPostView {
  postId: Types.ObjectId;
  viewerId: string; // userId (ObjectId as string) or sessionId/fingerprint
  viewedAt: Date;
}

export interface IPostViewDocument extends IPostView {}

const PostViewSchema = new Schema<IPostView>(
  {
    postId: {
      type: Schema.Types.ObjectId,
      ref: "Posts",
      required: true,
      index: true,
    },
    viewerId: {
      type: String,
      required: true,
      index: true,
    },
    viewedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: false,
    collection: "PostViews",
  }
);

// Unique compound index - CRITICAL for deduplication
// This prevents duplicate views from the same viewer on the same post
PostViewSchema.index(
  { postId: 1, viewerId: 1 },
  { unique: true }
);

// TTL index - Auto-cleanup old views after 7 days (604800 seconds)
// This keeps the collection size manageable
PostViewSchema.index(
  { viewedAt: 1 },
  { expireAfterSeconds: 604800 } // 7 days
);

// Index for analytics queries
PostViewSchema.index({ postId: 1, viewedAt: -1 });

const PostViews = model<IPostViewDocument>("PostViews", PostViewSchema);
export default PostViews;
