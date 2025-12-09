import mongoose, { Document, Schema, Types } from "mongoose";

export interface IProgress {
  userId: Types.ObjectId;
  courseId: Types.ObjectId;
  progress: number;
  completedLessons: Types.ObjectId[];
  lastAccessedLesson?: Types.ObjectId;
  certificateIssued: boolean;
  certificateIssuedAt?: Date;
  totalTimeSpent: number;
}

export interface IProgressDocument extends IProgress, Document {
  calculateProgress(): Promise<number>;
  markLessonCompleted(lessonId: Types.ObjectId | string): Promise<IProgressDocument>;
}

const progressSchema = new Schema<IProgressDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    completedLessons: [{
      type: Schema.Types.ObjectId,
      ref: "Lesson",
    }],
    lastAccessedLesson: {
      type: Schema.Types.ObjectId,
      ref: "Lesson",
    },
    certificateIssued: {
      type: Boolean,
      default: false,
    },
    certificateIssuedAt: {
      type: Date,
    },
    totalTimeSpent: {
      type: Number,
      default: 0, // in seconds
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for faster queries
progressSchema.index({ userId: 1, courseId: 1 }, { unique: true });
progressSchema.index({ progress: 1 });
progressSchema.index({ updatedAt: -1 });

// Method to calculate progress percentage
progressSchema.methods.calculateProgress = async function(): Promise<number> {
  const Course = mongoose.model("Course");
  const course = await Course.findById(this.courseId);
  
  if (!course || !course.totalLessons || course.totalLessons === 0) {
    return 0;
  }
  
  const progress = Math.round((this.completedLessons.length / course.totalLessons) * 100);
  this.progress = progress;
  
  return progress;
};

// Method to mark lesson as completed
progressSchema.methods.markLessonCompleted = async function(lessonId: Types.ObjectId | string): Promise<IProgressDocument> {
  const lessonObjectId = typeof lessonId === 'string' ? new Types.ObjectId(lessonId) : lessonId;
  
  if (!this.completedLessons.some((id: Types.ObjectId) => id.equals(lessonObjectId))) {
    this.completedLessons.push(lessonObjectId);
    await this.calculateProgress();
    
    // Issue certificate if course is completed
    if (this.progress === 100 && !this.certificateIssued) {
      this.certificateIssued = true;
      this.certificateIssuedAt = new Date();
    }
    
    await this.save();
  }
  
  return this;
};

const Progress = mongoose.model<IProgressDocument>("Progress", progressSchema);

export default Progress;
