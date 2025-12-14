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
};
