const mongoose = require("mongoose");

const bundleSchema = new mongoose.Schema(
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
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
      },
    ],
    originalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    bundlePrice: {
      type: Number,
      required: true,
      min: 0,
    },
    discount: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    totalStudents: {
      type: Number,
      default: 0,
    },
  },
  { collection: "Bundles", timestamps: true }
);

// Indexes
bundleSchema.index({ slug: 1 });
bundleSchema.index({ isActive: 1 });
bundleSchema.index({ courses: 1 });

// Virtual for bundle URL
bundleSchema.virtual("url").get(function () {
  return `/bundles/${this.slug}`;
});

// Virtual for savings amount
bundleSchema.virtual("savings").get(function () {
  return this.originalPrice - this.bundlePrice;
});

// Method to check if user already owns any course in bundle
bundleSchema.methods.hasOwnedCourses = function (userPurchasedCourses = []) {
  return this.courses.some((courseId) =>
    userPurchasedCourses.includes(courseId.toString())
  );
};

// Method to get courses not owned by user
bundleSchema.methods.getNewCourses = function (userPurchasedCourses = []) {
  return this.courses.filter(
    (courseId) => !userPurchasedCourses.includes(courseId.toString())
  );
};

const Bundle = mongoose.model("Bundle", bundleSchema);
module.exports = Bundle;
