import { apiClient } from "../../utils/clientAxios";

export const answerService = {
  // Get answers by post ID
  getByPostId: async (postId) => {
    try {
      const response = await apiClient.get(`/posts/${postId}/answers`);
      if (response.success) {
        return response.data;
      }
      return [];
    } catch (error) {
      console.error('Error fetching answers:', error);
      throw error;
    }
  },

  // Create answer
  create: async (postId, content) => {
    try {
      const response = await apiClient.post(`/posts/${postId}/answers`, { content });
      return response.data;
    } catch (error) {
      console.error('Error creating answer:', error);
      throw error;
    }
  },

  // Accept answer
  accept: async (answerId) => {
    try {
      const response = await apiClient.post(`/answers/${answerId}/acceptance`);
      return response.data;
    } catch (error) {
      console.error('Error accepting answer:', error);
      throw error;
    }
  },

  // Vote answer
  vote: async (answerId, type) => {
    try {
      const response = await apiClient.post(`/answers/${answerId}/vote`, { type });
      return response.data;
    } catch (error) {
      console.error('Error voting answer:', error);
      throw error;
    }
  }
};
