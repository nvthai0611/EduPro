const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      default: "https://via.placeholder.com/400x300",
    },
    instructorName: {
      type: String,
      default: "Hoàng An IT",
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
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
    salePrice: {
      type: Number,
      min: 0,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    totalDuration: {
      type: Number,
      default: 0, // tổng phút
    },
    totalLessons: {
      type: Number,
      default: 0,
    },
    totalStudents: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 5,
      min: 1,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    previewLessons: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lesson",
      },
    ],
    whatYouWillLearn: [
      {
        type: String,
        trim: true,
      },
    ],
    requirements: [
      {
        type: String,
        trim: true,
      },
    ],
    targetAudience: [
      {
        type: String,
        trim: true,
      },
    ],
    modules: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Module",
      },
    ],
  },
  { collection: "Courses", timestamps: true }
);

// Indexes for better performance
courseSchema.index({ slug: 1 });
courseSchema.index({ category: 1, isPublished: 1 });
courseSchema.index({ isFeatured: 1, isPublished: 1 });
courseSchema.index({ level: 1, isPublished: 1 });
courseSchema.index({ price: 1, isPublished: 1 });

// Virtual for course URL
courseSchema.virtual("url").get(function () {
  return `/courses/${this.slug}`;
});

// Method to calculate discount percentage
courseSchema.methods.getDiscountPercentage = function () {
  if (this.salePrice && this.salePrice < this.price) {
    return Math.round(((this.price - this.salePrice) / this.price) * 100);
  }
  return 0;
};

// Method to get current price
courseSchema.methods.getCurrentPrice = function () {
  return this.salePrice || this.price;
};

const Course = mongoose.model("Course", courseSchema);
module.exports = Course;
