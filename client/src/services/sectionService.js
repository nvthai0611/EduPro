import { apiClient } from '../utils/clientAxios';

export const sectionService = {
  // Lấy sections với content cho learners (public)
  getSectionsWithContent: async (courseId) => {
    try {
      const response = await apiClient.get(`/sections/course/${courseId}/content`);
      return response.data;
    } catch (error) {
      console.error('Error fetching sections with content:', error);
      throw error;
    }
  }
};