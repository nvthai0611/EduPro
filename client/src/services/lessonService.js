import { apiClient } from '../utils/clientAxios';

export const lessonService = {
  // Lấy danh sách bài học của khóa học
  getLessonsByCourse: async (courseId) => {
    try {
      const response = await apiClient.get(`/courses/${courseId}/lessons`);

      return response;
    } catch (error) {
      console.error('Error fetching lessons:', error);
      throw error;
    }
  },

  // Lấy chi tiết bài học
  getLessonById: async (lessonId) => {
    try {
      const response = await apiClient.get(`/api/v1/lessons/${lessonId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching lesson:', error);
      throw error;
    }
  },

  // Lấy nội dung bài học (video, quiz, etc.)
  getLessonContent: async (lessonId) => {
    try {
      const response = await apiClient.get(`/articles/${lessonId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching lesson content:', error);
      throw error;
    }
  },

  // Lấy quiz của bài học
  getLessonQuiz: async (lessonId) => {
    try {
      const response = await apiClient.get(`/api/v1/lessons/${lessonId}/quiz`);
      return response.data;
    } catch (error) {
      console.error('Error fetching lesson quiz:', error);
      throw error;
    }
  },

  // Nộp bài quiz
  submitQuiz: async (lessonId, answers) => {
    try {
      const response = await apiClient.post(`/api/v1/lessons/${lessonId}/quiz/submit`, {
        answers
      });
      return response.data;
    } catch (error) {
      console.error('Error submitting quiz:', error);
      throw error;
    }
  },

  // Lấy kết quả quiz
  getQuizResult: async (lessonId) => {
    try {
      const response = await apiClient.get(`/api/v1/lessons/${lessonId}/quiz/result`);
      return response.data;
    } catch (error) {
      console.error('Error fetching quiz result:', error);
      throw error;
    }
  },

  // Đánh dấu bài học đã hoàn thành
  markLessonCompleted: async (lessonId) => {
    try {
      const response = await apiClient.post(`/api/v1/lessons/${lessonId}/complete`);
      return response.data;
    } catch (error) {
      console.error('Error marking lesson completed:', error);
      throw error;
    }
  },

  // Lấy bình luận của bài học
  getLessonComments: async (lessonId, params = {}) => {
    try {
      const response = await apiClient.get(`/api/v1/lessons/${lessonId}/comments`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching lesson comments:', error);
      throw error;
    }
  },

  // Thêm bình luận
  addComment: async (lessonId, content) => {
    try {
      const response = await apiClient.post(`/api/v1/lessons/${lessonId}/comments`, {
        content
      });
      return response.data;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  },

  // Like/unlike bình luận
  toggleCommentLike: async (commentId) => {
    try {
      const response = await apiClient.post(`/api/v1/comments/${commentId}/like`);
      return response.data;
    } catch (error) {
      console.error('Error toggling comment like:', error);
      throw error;
    }
  },

  // Trả lời bình luận
  replyToComment: async (commentId, content) => {
    try {
      const response = await apiClient.post(`/api/v1/comments/${commentId}/reply`, {
        content
      });
      return response.data;
    } catch (error) {
      console.error('Error replying to comment:', error);
      throw error;
    }
  },

  // Chỉnh sửa bình luận
  editComment: async (commentId, content) => {
    try {
      const response = await apiClient.put(`/api/v1/comments/${commentId}`, {
        content
      });
      return response.data;
    } catch (error) {
      console.error('Error editing comment:', error);
      throw error;
    }
  },

  // Xóa bình luận
  deleteComment: async (commentId) => {
    try {
      const response = await apiClient.delete(`/api/v1/comments/${commentId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  },

  // Article lesson APIs
  getArticleContent: async (lessonId) => {
    try {
      const response = await apiClient.get(`/articles/${lessonId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching article content:', error);
      throw error;
    }
  },

  createArticleLesson: async (payload) => {
    try {
      const response = await apiClient.post(`/admin/articles`, payload);
      return response.data;
    } catch (error) {
      console.error('Error creating article lesson:', error);
      throw error;
    }
  },

  updateArticleLesson: async (lessonId, payload) => {
    try {
      const response = await apiClient.patch(`/admin/articles/${lessonId}`, payload);
      return response.data;
    } catch (error) {
      console.error('Error updating article lesson:', error);
      throw error;
    }
  },

  getAdminArticleLesson: async (lessonId) => {
    try {
      const response = await apiClient.get(`/admin/articles/${lessonId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching article lesson:', error);
      throw error;
    }
  },

  getArticlesBySection: async (sectionId) => {
    try {
      const response = await apiClient.get(`/admin/articles/section/${sectionId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching section articles:', error);
      throw error;
    }
  },
};