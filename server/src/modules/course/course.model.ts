import mongoose, { Document, Schema, Types } from "mongoose";

export interface ICourse {
  title: string;
  slug: string; // SEO-friendly URL
  description: string;
  thumbnail: string;

  // Pricing & Sales
  price: number;
  discountPrice?: number;
  currency: string;

  // Instructor & Ownership
  instructorId: Types.ObjectId;
  managerId?: Types.ObjectId; // Người quản lý khóa học

  // Course Details
  category: string;
  //   level: "beginner" | "intermediate" | "advanced";
  language: string;
  duration: number; // Tổng thời lượng (phút)

  // Status & Visibility
  status: "draft" | "published" | "approved" | "pending" | "rejected";
  isPublic: boolean;
  isFeatured: boolean;

  // Statistics
  totalStudents: number;
  totalReviews: number;
  averageRating: number;

  // Content Structure
  modules: Types.ObjectId[]; // Ref to Module
  requirements: string[];
  whatYouWillLearn: string[];

  // Metadata
  tags: string[];
  certificateAvailable: boolean;

  // Review from instructor and admin before publishing
  reviewNote?: string;
  adminNote?: string;
  reviewAt?: Date;


  // soft delete
  isDeleted?: boolean;
}
export interface ICourseDocument extends ICourse, Document {
  //instance methods
  incrementStudentCount(): Promise<ICourseDocument>;
  updateAverageRating(newRating: number): Promise<ICourseDocument>;
  isOwnedBy(userId: Types.ObjectId | string): boolean;
  getModulesWithLessons(): Promise<any>;
}

const courseSchema = new Schema<ICourseDocument>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true, trim: true },
    thumbnail: { type: String, trim: true },
    price: { type: Number, required: true, default: 0 },
    instructorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    status:{
      type: String,
      enum: ["draft", "published", "approved", "pending", "rejected"],
      default: "draft",
    },
    // updated field for category later
    category: { type: String, trim: true },
    reviewNote: { type: String, trim: true },
    adminNote: { type: String, trim: true },
    reviewAt: { type: Date },
    isDeleted: { type: Boolean, default: false },
  },
  {
    collection: "Courses",
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);


const Course = mongoose.model<ICourseDocument>("Course", courseSchema);
export default Course;