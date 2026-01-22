import mongoose, { Schema, Document, Types } from "mongoose";

/**
 * Interface cho Submission
 */
export interface ISubmission extends Document {
  problemId: Types.ObjectId;
  userId: Types.ObjectId;
  connectionId?: string;
  sourceCode: string;
  languageId: number;
  status: string;
  results: any;
  createdAt: Date;
}

/**
 * Schema cho Submission
 */
const submissionSchema = new Schema<ISubmission>(
  {
    problemId: {
      type: Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    connectionId: {
      type: String,
    },
    sourceCode: {
      type: String,
      required: true,
    },
    languageId: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      default: "In Queue",
    },
    results: {
      type: Array,
      default: [],
    }
  },
  {
    collection: "Submissions",
    timestamps: true
  }
);

const SubmissionModel = mongoose.model<ISubmission>(
  "Submission",
  submissionSchema
);

export default SubmissionModel;
