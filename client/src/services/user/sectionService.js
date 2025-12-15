import { apiClient } from '../../utils/clientAxios';

export const sectionService = {
  // Lấy sections kèm lessons (populated) cho user xem khóa học
  getSectionsWithLessons: async (courseId) => {
    try {
      const response = await apiClient.get(`/sections/course/${courseId}/with-lessons`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Lấy danh sách sections theo courseId
  getSectionsByCourseId: async (courseId) => {
    try {
      const response = await apiClient.get(`/sections/course/${courseId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default sectionService;
