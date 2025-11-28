import { apiClient } from '../utils/clientAxios';

export const courseService = {
  // Lấy danh sách khóa học
  getCourses: async (params = {}) => {
    try {
      // baseURL đã có /api/v1 rồi, chỉ cần /courses
      const response = await apiClient.get('/courses', params);
      console.log('getCourses response:', response);
      return response;
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }
  },

  // Lấy chi tiết khóa học
  getCourseById: async (id) => {
    try {
      const response = await apiClient.get(`/courses/${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching course:', error);
      throw error;
    }
  },

  // Tạo khóa học mới
  createCourse: async (courseData) => {
    try {
      const response = await apiClient.post('/courses', courseData);
      return response;
    } catch (error) {
      console.error('Error creating course:', error);
      throw error;
    }
  },

  // Cập nhật khóa học
  updateCourse: async (id, courseData) => {
    try {
      const response = await apiClient.patch(`/courses/${id}`, courseData);
      return response;
    } catch (error) {
      console.error('Error updating course:', error);
      throw error;
    }
  },

  // Xóa khóa học
  deleteCourse: async (id) => {
    try {
      const response = await apiClient.delete(`/courses/${id}`);
      return response;
    } catch (error) {
      console.error('Error deleting course:', error);
      throw error;
    }
  },

  // Submit khóa học để review
  submitForReview: async (id) => {
    try {
      const response = await apiClient.patch(`/courses/${id}/submit`);
      return response;
    } catch (error) {
      console.error('Error submitting course:', error);
      throw error;
    }
  }
};