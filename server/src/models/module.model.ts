import mongoose from "mongoose";


const moduleSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    order: {
      type: Number,
      required: true,
      min: 1,
    },
    lessons: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lesson",
      },
    ],
  },
  { collection: "Modules", timestamps: true }
);

// Indexes
moduleSchema.index({ courseId: 1, order: 1 });

// Virtual for total duration of module
moduleSchema.virtual("totalDuration").get(function () {
  // This will be populated when lessons are loaded
  return 0;
});

// Virtual for total lessons count
moduleSchema.virtual("totalLessons").get(function () {
  return this.lessons ? this.lessons.length : 0;
});

const Module = mongoose.model("Module", moduleSchema);
module.exports = Module;
