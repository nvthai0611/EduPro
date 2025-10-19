const mongoose = require("mongoose");

const learningPathSchema = new mongoose.Schema(
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
        courseId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Course",
          required: true,
        },
        order: {
          type: Number,
          required: true,
          min: 1,
        },
        isRequired: {
          type: Boolean,
          default: true,
        },
      },
    ],
    estimatedDuration: {
      type: String,
      required: true,
      trim: true,
    },
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      required: true,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    totalStudents: {
      type: Number,
      default: 0,
    },
  },
  { collection: "LearningPaths", timestamps: true }
);

// Indexes
learningPathSchema.index({ slug: 1 });
learningPathSchema.index({ isPublished: 1 });
learningPathSchema.index({ level: 1, isPublished: 1 });
learningPathSchema.index({ "courses.courseId": 1 });

// Virtual for learning path URL
learningPathSchema.virtual("url").get(function () {
  return `/learning-paths/${this.slug}`;
});

// Virtual for total courses count
learningPathSchema.virtual("totalCourses").get(function () {
  return this.courses ? this.courses.length : 0;
});

// Method to get courses in order
learningPathSchema.methods.getCoursesInOrder = function () {
  return this.courses.sort((a, b) => a.order - b.order);
};

// Method to get next course for user
learningPathSchema.methods.getNextCourse = function (userCompletedCourses = []) {
  const orderedCourses = this.getCoursesInOrder();
  
  for (const courseItem of orderedCourses) {
    if (!userCompletedCourses.includes(courseItem.courseId.toString())) {
      return courseItem.courseId;
    }
  }
  
  return null; // All courses completed
};

// Method to calculate user progress in learning path
learningPathSchema.methods.calculateUserProgress = function (userCompletedCourses = []) {
  const completedCount = this.courses.filter((courseItem) =>
    userCompletedCourses.includes(courseItem.courseId.toString())
  ).length;
  
  return Math.round((completedCount / this.courses.length) * 100);
};

// Static method to get learning paths by level
learningPathSchema.statics.getByLevel = function (level, page = 1, limit = 10) {
  return this.find({ level, isPublished: true })
    .populate("courses.courseId", "title thumbnail price")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
};

const LearningPath = mongoose.model("LearningPath", learningPathSchema);
module.exports = LearningPath;
