import mongoose, { Schema, Document, Types } from "mongoose";
import slugify from "slugify";

export interface ITestCase extends Document {
  input: string;
  expectedOutput: string;
  isSample: boolean;
}

const testCaseSchema = new Schema<ITestCase>(
  {
    input: {
      type: String,
      required: true
    },
    expectedOutput: {
      type: String,
      required: true
    },
    isSample: {
      type: Boolean,
      default: false
    },
  },
  { _id: true }
);

/* ================= PROBLEM ================= */

export interface IProblem extends Document {
  title: string;
  slug?: string;
  description: string;

  difficulty: "Easy" | "Medium" | "Hard";

  constraints?: string;
  inputFormat?: string;
  outputFormat?: string;

  timeLimit: number;
  memoryLimit: number;

  testCases: Types.DocumentArray<ITestCase>;

  isPublished: boolean;
  isDeleted: boolean;

  createdBy?: Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

const problemSchema = new Schema<IProblem>(
  {
    title: { type: String, required: true },

    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    description: { type: String, required: true },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Easy",
      index: true,
    },

    constraints: String,
    inputFormat: String,
    outputFormat: String,

    timeLimit: {
      type: Number,
      default: 1.0,
    },

    memoryLimit: {
      type: Number,
      default: 128000,
    },

    testCases: [testCaseSchema],

    isPublished: {
      type: Boolean,
      default: false,
      index: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    collection: "Problems",
    timestamps: true,
  }
);

problemSchema.pre("validate", async function (next) {
  // chỉ sinh slug khi tạo mới
  if (!this.slug && this.title) {
    const Problem = this.constructor as mongoose.Model<IProblem>;

    const baseSlug = slugify(this.title, {
      lower: true,
      strict: true,
      locale: "vi",
    });

    let slug = baseSlug;
    let count = 1;

    while (await Problem.exists({ slug })) {
      slug = `${baseSlug}-${count++}`;
    }

    this.slug = slug;
  }

  next();
});

const ProblemModel = mongoose.model<IProblem>("Problem", problemSchema);

export default ProblemModel;
