import { apiClient } from '../../utils/clientAxios';

export const sectionService = {
  // Lấy sections kèm lessons (populated) cho user xem khóa học - FULL DATA
  getSectionsWithLessons: async (courseId) => {
    try {
      const response = await apiClient.get(`/sections/course/${courseId}/with-lessons`);
      return response;
    } catch (error) {
      console.log(error);
    }
  },

  // Lấy sections với minimal lesson data - CHIẾ CÁC FIELDS CẦN THIẾT CHO LIST (không pagination)
  getSectionsWithMinimalLessons: async (courseId) => {
    try {
      const response = await apiClient.get(`/sections/course/${courseId}/minimal`);
      return response;
    } catch (error) {
      console.log(error);
    }
  },

  // Lấy sections với minimal lesson data + PAGINATION (cho CourseDetail)
  getSectionsWithMinimalLessonsPaginated: async (courseId, page = 1, limit = 10) => {
    try {
      const response = await apiClient.get(`/sections/course/${courseId}/minimal/paginated?page=${page}&limit=${limit}`);
      return response;
    } catch (error) {
      console.log(error);
    }
  },

  // Lấy danh sách sections theo courseId
  getSectionsByCourseId: async (courseId) => {
    try {
      const response = await apiClient.get(`/sections/course/${courseId}`);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  },
};

export default sectionService;
