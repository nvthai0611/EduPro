import { apiClient } from '../utils/clientAxios';

export const lessonCommentService = {
  // Create comment: POST /lesson-comments/:lessonId/comment
  createComment: async (lessonId, data) => {
    const response = await apiClient.post(`/lesson-comments/${lessonId}/comment`, data);
    return response.data;
  },

  // Update comment: PUT /lesson-comments/:lessonId/comment
  updateComment: async (lessonId, data) => {
    const response = await apiClient.put(`/lesson-comments/${lessonId}/comment`, data);
    return response.data;
  },

  // Get my comment: GET /lesson-comments/:lessonId/comment/my
  getMyComment: async (lessonId) => {
    const response = await apiClient.get(`/lesson-comments/${lessonId}/comment/my`);
    return response.data;
  },

  // Get all comments for lesson: GET /lesson-comments/:lessonId/comments
  getCommentsForLesson: async (lessonId) => {
    const response = await apiClient.get(`/lesson-comments/${lessonId}/comments`);
    return response.data;
  },

  // Teacher reply: POST /lesson-comments/:commentId/reply
  teacherReply: async (commentId, data) => {
    const response = await apiClient.post(`/lesson-comments/${commentId}/reply`, data);
    return response.data;
  },

  // Delete comment: DELETE /lesson-comments/:lessonId/comment
  deleteComment: async (lessonId) => {
    const response = await apiClient.delete(`/lesson-comments/${lessonId}/comment`);
    return response.data;
  },

  // Update reply: PUT /lesson-comments/:commentId/reply/:replyIndex
  updateReply: async (commentId, replyIndex, data) => {
    const response = await apiClient.put(`/lesson-comments/${commentId}/reply/${replyIndex}`, data);
    return response.data;
  },

  // Delete reply: DELETE /lesson-comments/:commentId/reply/:replyIndex
  deleteReply: async (commentId, replyIndex) => {
    const response = await apiClient.delete(`/lesson-comments/${commentId}/reply/${replyIndex}`);
    return response.data;
  }
};
