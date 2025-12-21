import { apiClient } from '../utils/clientAxios';

export const lessonCommentService = {
  // Create comment: POST /lessons/:lessonId/comment
  createComment: async (lessonId, data) => {
    const response = await apiClient.post(`/lessons/${lessonId}/comment`, data);
    return response.data;
  },

  // Update comment: PUT /lessons/:lessonId/comment
  updateComment: async (lessonId, data) => {
    const response = await apiClient.put(`/lessons/${lessonId}/comment`, data);
    return response.data;
  },

  // Get my comment: GET /lessons/:lessonId/comment/my
  getMyComment: async (lessonId) => {
    const response = await apiClient.get(`/lessons/${lessonId}/comment/my`);
    return response.data;
  },

  // Get all comments for lesson: GET /lessons/:lessonId/comments
  getCommentsForLesson: async (lessonId) => {
    const response = await apiClient.get(`/lessons/${lessonId}/comments`);
    return response.data;
  },

  // Teacher reply: POST /lessons/:commentId/reply
  teacherReply: async (commentId, data) => {
    const response = await apiClient.post(`/lessons/${commentId}/reply`, data);
    return response.data;
  },

  // Delete comment: DELETE /lessons/:lessonId/comment
  deleteComment: async (lessonId) => {
    const response = await apiClient.delete(`/lessons/${lessonId}/comment`);
    return response.data;
  },

  // Update reply: PUT /lessons/:commentId/reply/:replyIndex
  updateReply: async (commentId, replyIndex, data) => {
    const response = await apiClient.put(`/lessons/${commentId}/reply/${replyIndex}`, data);
    return response.data;
  },

  // Delete reply: DELETE /lessons/:commentId/reply/:replyIndex
  deleteReply: async (commentId, replyIndex) => {
    const response = await apiClient.delete(`/lessons/${commentId}/reply/${replyIndex}`);
    return response.data;
  }
};
