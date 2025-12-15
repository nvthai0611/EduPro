import mongoose, { Document } from "mongoose";

export interface IArticle {
  sectionId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  content: string; // HTML content
  readingTime?: number; // in minutes
  order: number;
  
  isPreviewed?: boolean;
  isFree?: boolean;
  isPublished?: boolean;
  isDeleted?: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}

export interface IArticleDocument extends IArticle, Document {
  // custom methods
  isAccessible(userPurchasedCourses: string[]): boolean;
}

const articleSchema = new mongoose.Schema<IArticleDocument>(
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
    title: { 
      type: String, 
      required: true, 
      trim: true 
    },
    description: { 
      type: String, 
      trim: true 
    },
    content: { 
      type: String, 
      required: true 
    },
    readingTime: { 
      type: Number, 
      min: 0,
      default: 1
    },
    order: { 
      type: Number, 
      required: true, 
      min: 1 
    },
    
    isFree: { 
      type: Boolean, 
      default: false 
    },
    isPublished: { 
      type: Boolean, 
      default: false 
    },
    isDeleted: { 
      type: Boolean, 
      default: false 
    },
    isPreviewed: { 
      type: Boolean, 
      default: false 
    },
  },
  { 
    collection: "articles", 
    timestamps: true 
  }
);

// Indexes for performance
articleSchema.index({ courseId: 1, order: 1 });
articleSchema.index({ sectionId: 1, order: 1 });
articleSchema.index({ courseId: 1 });
articleSchema.index({ sectionId: 1 });
articleSchema.index({ isPublished: 1, isDeleted: 1 });

// Method to check if article is accessible
articleSchema.methods.isAccessible = function (userPurchasedCourses = []) {
  return this.isFree || userPurchasedCourses.includes(this.courseId.toString());
};

const Article = mongoose.model("Article", articleSchema);
export default Article;