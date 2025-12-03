import { apiClient } from '../utils/clientAxios';

const courseService = {
  // Lấy danh sách khóa học
  getCourses: async (params) => {
    try {
      // apiClient.get(url, params) - params là tham số thứ 2
      const response = await apiClient.get('/courses', { params });
      console.log('getCourses response:', response);
      return response;
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }
  },

  // Lấy chi tiết khóa học theo ID
  getCourseById: async (id) => {
    try {
      const response = await apiClient.get(`/courses/${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching course:', error);
      throw error;
    }
  },

  // Lấy chi tiết khóa học theo slug
  getCourseBySlug: async (slug) => {
    try {
      const response = await apiClient.get(`/courses/slug/${slug}`);
      return response;
    } catch (error) {
      console.error('Error fetching course by slug:', error);
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
      console.error('Error submitting course for review:', error);
      throw error;
    }
  },

  // Tìm kiếm khóa học
  searchCourses: async (query) => {
    try {
      const response = await apiClient.get('/courses/all', { search: query });
      return response;
    } catch (error) {
      console.error('Error searching courses:', error);
      throw error;
    }
  }
};

export { courseService };
export default courseService;