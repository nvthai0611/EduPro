import mongoose, { Schema, Types } from "mongoose";

export interface ISection {
  // courseId: mongoose.Types.ObjectId;

  title: string,
  description?: string,
  slug?: string,


  // thứ tự 
  order: number,

  // thuộc course nào 
  courseId: mongoose.Types.ObjectId,

  // danh sách lesson trong section
  lessons: mongoose.Types.ObjectId[],

  // duration
  duration?: number,
  totalLesson?: number,

  // status
  isPublished?: boolean,
  isDeleted?: boolean,
  isPreviewed?: boolean,

  // lịch sử chỉnh sửa
  createdAt?: Date,
  updatedAt?: Date,


}

export interface ISectionDocument extends ISection, Document {
  // custom methods (nếu có)
  calculateDuration(): Promise<number>;
  addLesson(lessonId: Types.ObjectId): void;
  removeLesson(lessonId: Types.ObjectId): void;
  reorderLessons(lessonIds: Types.ObjectId[]): void;
}

const sectionSchema = new Schema<ISectionDocument>(
  {
    
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
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
    lessons: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lesson",
      },
    ],
    isPublished: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isPreviewed: {
      type: Boolean,
      default: false,
    },
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

sectionSchema.methods.calculateDuration = async function (){
  // Logic to calculate total duration from lessons
  return 0;
}
sectionSchema.methods.addLesson = function (lessonId: Types.ObjectId) {
  if (!this.lessons?.includes(lessonId)) {
    this.lessons.push(lessonId);
  } 
};
sectionSchema.methods.removeLesson = function (lessonId: Types.ObjectId) {
  this.lessons = this.lessons.filter(
    (id: Types.ObjectId) => !id.equals(lessonId)
  );
};
sectionSchema.methods.reorderLessons = function (lessonIds: Types.ObjectId[]) {
  this.lessons = lessonIds;
};

const Section = mongoose.model("Section", sectionSchema);
export default Section;
