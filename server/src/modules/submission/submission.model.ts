import mongoose, { Document } from "mongoose";

export interface ITeacherReply {
  teacherId: mongoose.Types.ObjectId;
  content: string;
  createdAt?: Date;
}

export interface ILessonComment {
  lessonId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  content: string;
  teacherReplies?: ITeacherReply[];
  createdAt?: Date;
  updatedAt?: Date;
  isEdited?: boolean; // New field to track if the comment is edited
}

export interface ILessonCommentDocument extends ILessonComment, Document {}

const teacherReplySchema = new mongoose.Schema<ITeacherReply>(
  {
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const lessonCommentSchema = new mongoose.Schema<ILessonCommentDocument>(
  {
    lessonId: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson", required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    teacherReplies: { type: [teacherReplySchema], default: [] },
    isEdited: { type: Boolean, default: false }, // New field to track if the comment is edited
  },
  { collection: "LessonComment", timestamps: true }
);

// Ensure one comment per student per lesson
lessonCommentSchema.index({ lessonId: 1, studentId: 1 }, { unique: true });

const LessonComment = mongoose.model<ILessonCommentDocument>("LessonComment", lessonCommentSchema);
export default LessonComment;
