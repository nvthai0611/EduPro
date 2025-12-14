import LessonComment, { ILessonCommentDocument } from "./submission.model";

export default {
  // Create student comment
  async createComment(data: { lessonId: string; studentId: string; content: string }): Promise<ILessonCommentDocument> {
    const comment = new LessonComment(data);
    return await comment.save();
  },

  // Find comment by lesson and student
  async findByLessonAndStudent(lessonId: string, studentId: string): Promise<ILessonCommentDocument | null> {
    return await LessonComment.findOne({ lessonId, studentId }).populate('studentId', 'fullName avatar');
  },

  // Find all comments for a lesson
  async findByLesson(lessonId: string): Promise<ILessonCommentDocument[]> {
    return await LessonComment.find({ lessonId })
      .populate('studentId', 'fullName avatar role') // Include role field
      .populate('teacherReplies.teacherId', 'fullName avatar')
      .sort({ createdAt: -1 });
  },

  // Update student comment
  async updateComment(lessonId: string, studentId: string, content: string): Promise<ILessonCommentDocument | null> {
    return await LessonComment.findOneAndUpdate(
      { lessonId, studentId },
      { content, isEdited: true }, // Set isEdited to true
      { new: true }
    ).populate('studentId', 'fullName avatar');
  },

  // Add teacher reply
  async addTeacherReply(commentId: string, teacherId: string, content: string): Promise<ILessonCommentDocument | null> {
    return await LessonComment.findByIdAndUpdate(
      commentId,
      {
        $push: {
          teacherReplies: {
            teacherId,
            content,
            createdAt: new Date(),
          },
        },
      },
      { new: true }
    )
      .populate('studentId', 'fullName avatar')
      .populate('teacherReplies.teacherId', 'fullName avatar');
  },
};
