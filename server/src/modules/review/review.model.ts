import { Schema, model, Types, Document } from "mongoose";

export interface IReview extends Document {
  courseId: Types.ObjectId;
  userId: Types.ObjectId;
  rating: number;
  comment: string;
  createdAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  { collection: 'Reviews', timestamps: { createdAt: true, updatedAt: false } }
);

/**
 * 1 user chỉ review 1 lần / course
 */
ReviewSchema.index({ courseId: 1, userId: 1 }, { unique: true });

export const Review = model<IReview>("Review", ReviewSchema);
