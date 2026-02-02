import mongoose, { Document } from "mongoose";

export interface ILesson {

  sectionId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  title: string;
  description?: string;

  type: "video" | "quiz" | "article"; // Added "article" back for new articles

  order: number;

  // video specific
  videoUrl?: string;
  videoDuration?: number; // in seconds
  
  // article specific
  content?: string; // HTML content for articles
  readingTime?: number; // in minutes for articles
  
  // quiz specific (upcoming)
  // quizId?: mongoose.Types.ObjectId;
  // passingScore?: number;
  
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
      ref: "Section",
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    order: { type: Number, required: true, min: 1 },
    
    // Video fields (only for video type)
    videoUrl: { type: String },
    videoDuration: { type: Number, min: 0 },
    
    // Article fields (only for article type)
    content: { type: String }, // HTML content
    readingTime: { type: Number, min: 0 }, // in minutes
    
    isFree: { type: Boolean, default: false },

    type: {
      type: String,
      enum: ["video", "quiz", "article"], // Added "article" back
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
lessonSchema.index({ sectionId: 1, order: 1 });
lessonSchema.index({ courseId: 1 });
lessonSchema.index({ sectionId: 1 });
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
