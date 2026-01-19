import { model, Schema, Types } from "mongoose";

export interface IComment {
    targetType: "post" | "answer";
    targetId: Types.ObjectId;
    authorId: Types.ObjectId;
    authorName: string;
    content: string;
    parentId?: Types.ObjectId;
    likesCount: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ICommentDocument extends IComment {}

const CommentSchema = new Schema<ICommentDocument>(
    {
        targetType: { type: String, enum: ["post", "answer"], required: true },
        targetId: { type: Schema.Types.ObjectId, required: true }, // Dynamic ref
        authorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        authorName: { type: String, trim: true },
        content: { type: String, required: true },
        parentId: { type: Schema.Types.ObjectId, ref: "Comment", default: null },
        likesCount: { type: Number, default: 0 },
    },
    {
        collection: "Comments",
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// CRITICAL INDICES
CommentSchema.index({ targetType: 1, targetId: 1 });
CommentSchema.index({ parentId: 1 });

const Comments = model<ICommentDocument>("Comment", CommentSchema);

export default Comments;
