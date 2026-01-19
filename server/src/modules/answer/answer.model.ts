import { model, Schema, Types } from "mongoose";

export interface IAnswer {
    postId: Types.ObjectId;
    authorId: Types.ObjectId;
    authorName: string;
    content: string;
    likesCount: number;
    isAccepted: boolean;
    commentsCount: number; // Comments strictly on this answer
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IAnswerDocument extends IAnswer {}

const AnswerSchema = new Schema<IAnswerDocument>(
    {
        postId: { type: Schema.Types.ObjectId, ref: "Posts", required: true },
        authorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        authorName: { type: String, trim: true }, // Denormalized for display
        content: { type: String, required: true },
        likesCount: { type: Number, default: 0 },
        isAccepted: { type: Boolean, default: false },
        commentsCount: { type: Number, default: 0 },
    },
    {
        collection: "Answers",
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Index for fetching answers by post, sorted by acceptance and likes could safely use this or rely on sorting logic.
// Basic index on postId is essential.
AnswerSchema.index({ postId: 1 });

const Answers = model<IAnswerDocument>("Answer", AnswerSchema);

export default Answers;
