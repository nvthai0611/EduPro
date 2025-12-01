import mongoose, { Document } from "mongoose";

export interface ILesson {

  sectionId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  title: string;
  description?: string;

  type: "video" | "article" | "quiz";

  order: number;

  // video specific
  videoUrl?: string;
  videoDuration?: number; // in seconds
  isPreviewed?: boolean;
  isFree?: boolean;

  isPublished?: boolean;
  isDeleted?: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}

export interface ILessonDocument extends ILesson, Document {
  // custom methods (if any)
  isAccessible(userPurchasedCourses: string[]): boolean;
  formattedDuration(): string;
}
const lessonSchema = new mongoose.Schema<ILessonDocument>(
  {
    sectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sections",
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Courses",
      required: true,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    order: { type: Number, required: true, min: 1 },
    videoUrl: { type: String, required: true },
    videoDuration: { type: Number, required: true, min: 0 }, // giây
    isFree: { type: Boolean, default: false },

    type: {
      type: String,
      enum: ["video", "article", "quiz"],
      required: true,
    },
    isPublished: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    isPreviewed: { type: Boolean, default: false },
  },
  { collection: "Lesson", timestamps: true }
);

// Indexes
lessonSchema.index({ courseId: 1, order: 1 });
lessonSchema.index({ moduleId: 1, order: 1 });
lessonSchema.index({courseId: 1});// tối ưu truy vấn
lessonSchema.index({moduleId: 1});
// Virtual for formatted duration
lessonSchema.virtual("formattedDuration").get(function () {
  const minutes = Math.floor(this.videoDuration / 60);
  const seconds = this.videoDuration % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
});

// Method to check if lesson is accessible (free or user has purchased course)
lessonSchema.methods.isAccessible = function (userPurchasedCourses = []) {
  return this.isFree || userPurchasedCourses.includes(this.courseId.toString());
};

const Lesson = mongoose.model("Lesson", lessonSchema);
export default Lesson;
