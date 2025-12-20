import repository from "./submission.repository";

export default {
  // Create student comment (enforce one per lesson per student)
  async createStudentComment(data: { lessonId: string; studentId: string; content: string }) {
    // Check if student already has a comment for this lesson
    const existing = await repository.findByLessonAndStudent(data.lessonId, data.studentId);
    if (existing) {
      const error: any = new Error("Bạn đã có nhận xét cho bài học này. Vui lòng cập nhật nhận xét cũ.");
      error.status = 400;
      throw error;
    }

    return await repository.createComment(data);
  },

  // Update student comment
  async updateStudentComment(data: { lessonId: string; studentId: string; content: string }) {
    const updated = await repository.updateComment(data.lessonId, data.studentId, data.content);
    if (!updated) {
      const error: any = new Error("Không tìm thấy nhận xét để cập nhật");
      error.status = 404;
      throw error;
    }
    return updated;
  },

  // Get all comments for a lesson (teacher/admin only)
  async getCommentsForLesson(lessonId: string) {
    return await repository.findByLesson(lessonId);
  },

  // Add teacher reply to a comment
  async addTeacherReplyToComment(data: { commentId: string; teacherId: string; content: string }) {
    const updated = await repository.addTeacherReply(data.commentId, data.teacherId, data.content);
    if (!updated) {
      const error: any = new Error("Không tìm thấy nhận xét");
      error.status = 404;
      throw error;
    }
    return updated;
  },

  // Delete student comment
  async deleteStudentComment(data: { lessonId: string; studentId: string }) {
    const deleted = await repository.deleteComment(data.lessonId, data.studentId);
    if (!deleted) {
      const error: any = new Error("Không tìm thấy nhận xét để xóa");
      error.status = 404;
      throw error;
    }
    return deleted;
  },

  // Update teacher reply
  async updateTeacherReply(data: { commentId: string; replyIndex: number; content: string }) {
    const updated = await repository.updateTeacherReply(data.commentId, data.replyIndex, data.content);
    if (!updated) {
      const error: any = new Error("Không tìm thấy phản hồi để cập nhật");
      error.status = 404;
      throw error;
    }
    return updated;
  },

  // Delete teacher reply
  async deleteTeacherReply(data: { commentId: string; replyIndex: number }) {
    const updated = await repository.deleteTeacherReply(data.commentId, data.replyIndex);
    if (!updated) {
      const error: any = new Error("Không tìm thấy phản hồi để xóa");
      error.status = 404;
      throw error;
    }
    return updated;
  },
};
