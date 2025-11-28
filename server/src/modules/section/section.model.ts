import mongoose from "mongoose";

const sectionSchema = new mongoose.Schema(
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
  { collection: "Sections", timestamps: true }
);

// Indexes
sectionSchema.index({ courseId: 1, order: 1 });
// Virtual for total duration of section
sectionSchema.virtual("totalDuration").get(function () {
  // This will be populated when lessons are loaded
  return 0;
});

// Virtual for total lessons count
sectionSchema.virtual("totalLessons").get(function () {
  return this.lessons ? this.lessons.length : 0;
});

const Section = mongoose.model("Section", sectionSchema);
export default Section;
