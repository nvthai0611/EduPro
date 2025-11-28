import { Schema, model, Document, Types } from "mongoose";

export interface ICourse extends Document {
  title: string;
  slug: string;
  description: string;
  thumbnail?: string;
  instructorName?: string;
  category: Types.ObjectId;
  level: "beginner" | "intermediate" | "advanced";
  price: number;
  salePrice?: number;
  isPublished?: boolean;
  isFeatured?: boolean;
  totalDuration?: number;
  totalLessons?: number;
  totalStudents?: number;
  rating?: number;
  reviewCount?: number;

  previewLessons?: Types.ObjectId[];
  whatYouWillLearn?: string[];
  requirements?: string[];
  targetAudience?: string[];
  modules?: Types.ObjectId[];

  url: string;
  getDiscountPercentage(): number;
  getCurrentPrice(): number;
}

const CourseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: true, trim: true },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    description: { type: String, required: true },

    thumbnail: {
      type: String,
      default: "https://via.placeholder.com/400x300",
    },

    instructorName: {
      type: String,
      default: "Hoàng An IT",
    },

    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      required: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    salePrice: { type: Number, min: 0 },

    isPublished: { type: Boolean, default: false },

    isFeatured: { type: Boolean, default: false },

    totalDuration: { type: Number, default: 0 },

    totalLessons: { type: Number, default: 0 },

    totalStudents: { type: Number, default: 0 },

    rating: { type: Number, default: 5, min: 1, max: 5 },

    reviewCount: { type: Number, default: 0 },

    previewLessons: [
      {
        type: Schema.Types.ObjectId,
        ref: "Lesson",
      },
    ],

    whatYouWillLearn: [{ type: String, trim: true }],

    requirements: [{ type: String, trim: true }],

    targetAudience: [{ type: String, trim: true }],

    modules: [
      {
        type: Schema.Types.ObjectId,
        ref: "Module",
      },
    ],
  },
  {
    collection: "Courses",
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

CourseSchema.index({ slug: 1 });
CourseSchema.index({ category: 1, isPublished: 1 });
CourseSchema.index({ isFeatured: 1, isPublished: 1 });
CourseSchema.index({ level: 1, isPublished: 1 });
CourseSchema.index({ price: 1, isPublished: 1 });

CourseSchema.virtual("url").get(function () {
  return `/courses/${this.slug}`;
});

CourseSchema.methods.getDiscountPercentage = function (): number {
  if (this.salePrice && this.salePrice < this.price) {
    return Math.round(((this.price - this.salePrice) / this.price) * 100);
  }
  return 0;
};

CourseSchema.methods.getCurrentPrice = function (): number {
  return this.salePrice || this.price;
};

export const Course = model<ICourse>("Course", CourseSchema);