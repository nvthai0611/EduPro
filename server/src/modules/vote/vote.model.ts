import { model, Schema, Types } from "mongoose";

export interface IAnswerVote {
    answerId: Types.ObjectId;
    userId: Types.ObjectId;
    type: "up" | "down";
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IAnswerVoteDocument extends IAnswerVote {}

const AnswerVoteSchema = new Schema<IAnswerVoteDocument>(
    {
        answerId: { type: Schema.Types.ObjectId, ref: "Answer", required: true },
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        type: { type: String, enum: ["up", "down"], required: true },
    },
    {
        collection: "AnswerVotes",
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Compound index to ensure one vote per user per answer
AnswerVoteSchema.index({ answerId: 1, userId: 1 }, { unique: true });

const AnswerVotes = model<IAnswerVoteDocument>("AnswerVote", AnswerVoteSchema);

export default AnswerVotes;
