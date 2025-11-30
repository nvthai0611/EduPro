import mongoose, { Document, Schema, Types } from "mongoose";

export interface ICourse {
  title: string;
  slug: string;
  description: string;
  thumbnail?: string;
  instructorId: Types.ObjectId;
  instructorName?: string;
  managerId?: Types.ObjectId;
  
  category: Types.ObjectId | string;
  level: "beginner" | "intermediate" | "advanced";
  
  price: number;
  salePrice?: number;
  discountPrice?: number;
  currency?: string;
  
  status: "draft" | "published" | "approved" | "pending" | "rejected";
  isPublished?: boolean;
  isPublic?: boolean;
  isFeatured?: boolean;
  
  language?: string;
  duration?: number;
  totalDuration?: number;
  totalLessons?: number;
  totalStudents: number;
  totalReviews?: number;
  averageRating?: number;
  rating?: number;
  reviewCount?: number;
  
  modules?: Types.ObjectId[];
  previewLessons?: Types.ObjectId[];
  requirements?: string[];
  whatYouWillLearn?: string[];
  targetAudience?: string[];
  
  tags?: string[];
  certificateAvailable?: boolean;
  
  reviewNote?: string;
  adminNote?: string;
  reviewAt?: Date;
  
  isDeleted?: boolean;
}

export interface ICourseDocument extends ICourse, Document {
  incrementStudentCount(): Promise<ICourseDocument>;
  updateAverageRating(newRating: number): Promise<ICourseDocument>;
  isOwnedBy(userId: Types.ObjectId | string): boolean;
  getModulesWithLessons(): Promise<any>;
  getDiscountPercentage(): number;
  getCurrentPrice(): number;
  url: string;
}

const courseSchema = new Schema<ICourseDocument>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, lowercase: true, trim: true },
    description: { type: String, required: true, trim: true },
    thumbnail: { 
      type: String, 
      default: "https://via.placeholder.com/400x300",
      trim: true 
    },
    
    instructorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    instructorName: { type: String, trim: true },
    managerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    
    category: {
      type: Schema.Types.Mixed, // Accept both String and ObjectId
      default: null,
    },
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },
    
    price: { type: Number, required: true, default: 0, min: 0 },
    salePrice: { type: Number, min: 0 },
    discountPrice: { type: Number, min: 0 },
    currency: { type: String, default: "VND" },
    
    status: {
      type: String,
      enum: ["draft", "published", "approved", "pending", "rejected"],
      default: "draft",
    },

    isFeatured: { type: Boolean, default: false },
    
    language: { type: String, default: "vi" },
    duration: { type: Number, default: 0 },
    totalDuration: { type: Number, default: 0 },
    totalLessons: { type: Number, default: 0 },
    totalStudents: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    rating: { type: Number, default: 5, min: 1, max: 5 },
    reviewCount: { type: Number, default: 0 },
    
    modules: [{
      type: Schema.Types.ObjectId,
      ref: "Module",
    }],
    previewLessons: [{
      type: Schema.Types.ObjectId,
      ref: "Lesson",
    }],
    requirements: [{ type: String, trim: true }],
    whatYouWillLearn: [{ type: String, trim: true }],
    targetAudience: [{ type: String, trim: true }],
    
    tags: [{ type: String, trim: true }],
    certificateAvailable: { type: Boolean, default: false },
    
    reviewNote: { type: String, trim: true },
    adminNote: { type: String, trim: true },
    reviewAt: { type: Date },
    
    isDeleted: { type: Boolean, default: false }
  },
  {
    collection: "Courses",
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Pre-save hook to generate slug from title
courseSchema.pre("save", async function (next) {
  if (this.isModified("title") && !this.slug) {
    // Generate slug from title
    const baseSlug = this.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "") // Remove special characters
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/--+/g, "-") // Replace multiple hyphens with single hyphen
      .trim();
    
    // Check for uniqueness
    let slug = baseSlug;
    let counter = 1;
    while (await mongoose.model("Course").findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    this.slug = slug;
  }
  next();
});

// Indexes
courseSchema.index({ instructorId: 1 });
courseSchema.index({ category: 1, status: 1 });
courseSchema.index({ isFeatured: 1, status: 1 });
courseSchema.index({ level: 1, status: 1 });
courseSchema.index({ price: 1, status: 1 });
courseSchema.index({ isDeleted: 1 });
courseSchema.index({ title: "text", description: "text" });

// Virtuals
courseSchema.virtual("url").get(function (this: ICourseDocument) {
  return `/courses/${this.slug}`;
});

courseSchema.virtual("effectivePrice").get(function (this: ICourseDocument) {
  return this.salePrice || this.discountPrice || this.price;
});

// Instance Methods
courseSchema.methods.incrementStudentCount = async function (this: ICourseDocument) {
  this.totalStudents += 1;
  return this.save();
};

courseSchema.methods.updateAverageRating = async function (
  this: ICourseDocument,
  newRating: number
) {
  const totalRating = (this.averageRating || 0) * (this.totalReviews || 0);
  this.totalReviews = (this.totalReviews || 0) + 1;
  this.averageRating = (totalRating + newRating) / this.totalReviews;
  return this.save();
};

courseSchema.methods.isOwnedBy = function (
  this: ICourseDocument,
  userId: Types.ObjectId | string
) {
  return (
    this.instructorId.toString() === userId.toString() ||
    (this.managerId && this.managerId.toString() === userId.toString())
  );
};

courseSchema.methods.getModulesWithLessons = async function (this: ICourseDocument) {
  return this.populate({
    path: "modules",
    populate: { path: "lessons" },
  });
};

courseSchema.methods.getDiscountPercentage = function (this: ICourseDocument): number {
  const salePrice = this.salePrice || this.discountPrice;
  if (salePrice && salePrice < this.price) {
    return Math.round(((this.price - salePrice) / this.price) * 100);
  }
  return 0;
};

courseSchema.methods.getCurrentPrice = function (this: ICourseDocument): number {
  return this.salePrice || this.discountPrice || this.price;
};

const Course = mongoose.model<ICourseDocument>("Course", courseSchema);
export default Course;
