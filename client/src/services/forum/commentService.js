import { apiClient } from "../../utils/clientAxios";

export const commentService = {
  // Get comments (Lazy load)
  getComments: async (targetType, targetId) => {
    try {
      // API expects query params: targetType, targetId
      const response = await apiClient.get(`/comments`, { targetType, targetId });
      if (response.success) {
        return response.data;
      }
      return [];
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  },

  // Create comment on Post
  createPostComment: async (postId, content, parentId = null) => {
    try {
      const response = await apiClient.post(`/posts/${postId}/comments`, { content, parentId });
      return response.data;
    } catch (error) {
       console.error('Error creating post comment:', error);
       throw error;
    }
  },

  // Create comment on Answer
  createAnswerComment: async (answerId, content, parentId = null) => {
     try {
       const response = await apiClient.post(`/answers/${answerId}/comments`, { content, parentId });
       return response.data;
     } catch (error) {
        console.error('Error creating answer comment:', error);
        throw error;
     }
  }
};
