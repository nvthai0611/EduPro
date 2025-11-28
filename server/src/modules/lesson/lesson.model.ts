import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema(
  {
    moduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module",
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    order: { type: Number, required: true, min: 1 },
    videoUrl: { type: String, required: true },
    videoDuration: { type: Number, required: true, min: 0 }, // giây
    isFree: { type: Boolean, default: false },
    resources: [
      {
        name: { type: String, required: true },
        url: { type: String, required: true },
        type: {
          type: String,
          enum: ["pdf", "code", "slides", "other"],
          default: "other",
        },
      },
    ],
  },
  { collection: "Lessons", timestamps: true }
);

// Indexes
lessonSchema.index({ courseId: 1, order: 1 });
lessonSchema.index({ moduleId: 1, order: 1 });
lessonSchema.index({courseId: 1});// tối ưu truy vấn
lessonSchema.index({moduleId: 1});
// Virtual for formatted duration
lessonSchema.virtual("formattedDuration").get(function () {
  const minutes = Math.floor(this.videoDuration / 60);
  const seconds = this.videoDuration % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
});

// Method to check if lesson is accessible (free or user has purchased course)
lessonSchema.methods.isAccessible = function (userPurchasedCourses = []) {
  return this.isFree || userPurchasedCourses.includes(this.courseId.toString());
};

const Lesson = mongoose.model("Lesson", lessonSchema);
export default Lesson;
