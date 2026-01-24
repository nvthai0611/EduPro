import mongoose, {
  Schema,
  Types,
  HydratedDocument,
  Model,
} from "mongoose";

/* ================= INTERFACES ================= */

export interface IProgress {
  userId: Types.ObjectId;
  courseId: Types.ObjectId;

  completedLessons: Types.ObjectId[];
  lastAccessedLesson?: Types.ObjectId;
}

export interface IProgressMethods {
  markLessonCompleted(
    lessonId: Types.ObjectId | string
  ): Promise<ProgressDocument>;

  unmarkLessonCompleted(
    lessonId: Types.ObjectId | string
  ): Promise<ProgressDocument>;
}

export type ProgressDocument = HydratedDocument<
  IProgress,
  IProgressMethods
>;

export type ProgressModel = Model<
  IProgress,
  {},
  IProgressMethods
>;

/* ================= SCHEMA ================= */

const progressSchema = new Schema<IProgress, {}, IProgressMethods>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },

    completedLessons: [
      {
        type: Schema.Types.ObjectId,
        ref: "Lesson",
      },
    ],

    lastAccessedLesson: {
      type: Schema.Types.ObjectId,
      ref: "Lesson",
    },

  },
  {
    timestamps: true,
    collection: "Progresses",
  }
);

/* ================= INDEXES ================= */

progressSchema.index({ userId: 1, courseId: 1 }, { unique: true });
progressSchema.index({ updatedAt: -1 });

/* ================= METHODS ================= */

progressSchema.methods.markLessonCompleted = async function (
  lessonId: Types.ObjectId | string
) {
  const id =
    typeof lessonId === "string"
      ? new Types.ObjectId(lessonId)
      : lessonId;

  if (!this.completedLessons.some(l => l.equals(id))) {
    this.completedLessons.push(id);
  }

  this.lastAccessedLesson = id;
  await this.save();
  return this;
};

progressSchema.methods.unmarkLessonCompleted = async function (
  lessonId: Types.ObjectId | string
) {
  const id =
    typeof lessonId === "string"
      ? new Types.ObjectId(lessonId)
      : lessonId;

  this.completedLessons = this.completedLessons.filter(
    l => !l.equals(id)
  );

  await this.save();
  return this;
};

/* ================= MODEL ================= */

const Progress = mongoose.model<IProgress>(
  "Progress",
  progressSchema
);

export default Progress;
