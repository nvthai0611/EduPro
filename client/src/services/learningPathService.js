import { clientAxios } from '@/utils/clientAxios';

const learningPathService = {
  // Get all learning paths
  getAllLearningPaths: async (params = {}) => {
    try {
      const response = await clientAxios.get('/learning-paths', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get learning path detail by slug or ID
  getLearningPathDetail: async (slug) => {
    try {
      const response = await clientAxios.get(`/learning-paths/${slug}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get featured learning paths
  getFeaturedLearningPaths: async () => {
    try {
      const response = await clientAxios.get('/learning-paths?featured=true&limit=6');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get learning paths by level
  getLearningPathsByLevel: async (level) => {
    try {
      const response = await clientAxios.get(`/learning-paths?level=${level}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export { learningPathService };
