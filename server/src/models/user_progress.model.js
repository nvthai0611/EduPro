const mongoose = require("mongoose");

const userProgressSchema = new mongoose.Schema(
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
    purchasedAt: {
      type: Date,
      required: true,
    },
    completedLessons: [
      {
        lessonId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Lesson",
          required: true,
        },
        completedAt: {
          type: Date,
          required: true,
        },
        watchDuration: {
          type: Number,
          default: 0, // giây
        },
      },
    ],
    lastWatchedLesson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    totalWatchTime: {
      type: Number,
      default: 0, // tổng phút đã xem
    },
  },
  { collection: "UserProgress", timestamps: true }
);

// Indexes
userProgressSchema.index({ userId: 1, courseId: 1 }, { unique: true });
userProgressSchema.index({ userId: 1 });
userProgressSchema.index({ courseId: 1 });

// Method to calculate progress percentage
userProgressSchema.methods.calculateProgress = function (totalLessons) {
  if (totalLessons === 0) return 0;
  return Math.round((this.completedLessons.length / totalLessons) * 100);
};

// Method to check if lesson is completed
userProgressSchema.methods.isLessonCompleted = function (lessonId) {
  return this.completedLessons.some(
    (lesson) => lesson.lessonId.toString() === lessonId.toString()
  );
};

// Method to mark lesson as completed
userProgressSchema.methods.markLessonCompleted = function (lessonId, watchDuration = 0) {
  const existingIndex = this.completedLessons.findIndex(
    (lesson) => lesson.lessonId.toString() === lessonId.toString()
  );

  if (existingIndex >= 0) {
    // Update existing completion
    this.completedLessons[existingIndex].completedAt = new Date();
    this.completedLessons[existingIndex].watchDuration = watchDuration;
  } else {
    // Add new completion
    this.completedLessons.push({
      lessonId,
      completedAt: new Date(),
      watchDuration,
    });
  }

  this.lastWatchedLesson = lessonId;
  return this.save();
};

// Method to get completion rate
userProgressSchema.methods.getCompletionRate = function () {
  return this.progress;
};

const UserProgress = mongoose.model("UserProgress", userProgressSchema);
module.exports = UserProgress;
