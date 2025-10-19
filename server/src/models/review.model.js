const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    isVerifiedPurchase: {
      type: Boolean,
      default: false,
    },
    likes: {
      type: Number,
      default: 0,
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
  },
  { collection: "Reviews", timestamps: true }
);

// Indexes
reviewSchema.index({ courseId: 1, createdAt: -1 });
reviewSchema.index({ userId: 1, courseId: 1 }, { unique: true });
reviewSchema.index({ rating: 1 });

// Virtual for formatted rating (stars)
reviewSchema.virtual("stars").get(function () {
  return "★".repeat(this.rating) + "☆".repeat(5 - this.rating);
});

// Method to like/unlike review
reviewSchema.methods.toggleLike = function () {
  this.likes += 1;
  return this.save();
};

// Static method to get course reviews with pagination
reviewSchema.statics.getCourseReviews = function (courseId, page = 1, limit = 10, sortBy = "newest") {
  let sortOptions = {};
  
  switch (sortBy) {
    case "newest":
      sortOptions = { createdAt: -1 };
      break;
    case "oldest":
      sortOptions = { createdAt: 1 };
      break;
    case "highest":
      sortOptions = { rating: -1 };
      break;
    case "lowest":
      sortOptions = { rating: 1 };
      break;
    case "most_liked":
      sortOptions = { likes: -1 };
      break;
    default:
      sortOptions = { createdAt: -1 };
  }

  return this.find({ courseId })
    .populate("userId", "fullName image")
    .sort(sortOptions)
    .skip((page - 1) * limit)
    .limit(limit);
};

// Static method to get average rating for a course
reviewSchema.statics.getAverageRating = function (courseId) {
  return this.aggregate([
    { $match: { courseId: mongoose.Types.ObjectId(courseId) } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: "$rating" },
        totalReviews: { $sum: 1 },
        ratingDistribution: {
          $push: "$rating",
        },
      },
    },
  ]);
};

// Static method to check if user can review (has purchased course)
reviewSchema.statics.canUserReview = async function (userId, courseId) {
  const UserProgress = mongoose.model("UserProgress");
  const progress = await UserProgress.findOne({ userId, courseId });
  return !!progress;
};

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;