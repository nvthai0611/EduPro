import mongoose, { Schema, Document, Types } from "mongoose";

/**
 * Interface cho Test Case
 */
export interface ITestCase extends Document {
  input: string;
  expectedOutput: string;
  isSample: boolean;
}

/**
 * Schema cho Test Case (embedded)
 */
const testCaseSchema = new Schema<ITestCase>(
  {
    input: {
      type: String,
      required: true,
    },
    expectedOutput: {
      type: String,
      required: true,
    },
    isSample: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: true, // mỗi test case có ID riêng
  }
);

/**
 * Interface cho Problem
 */
export interface IProblem extends Document {
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  timeLimit: number;
  memoryLimit: number;
  testCases: Types.DocumentArray<ITestCase>;
  createdAt: Date;
}

/**
 * Schema cho Problem
 */
const problemSchema = new Schema<IProblem>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Easy",
    },
    timeLimit: {
      type: Number,
      default: 1.0,
    },
    memoryLimit: {
      type: Number,
      default: 128000,
    },
    testCases: [testCaseSchema],
  },
  {
    collection: "Problems",
    timestamps: true
  }
);

const Problem = mongoose.model<IProblem>("Problem", problemSchema);

export default Problem;
