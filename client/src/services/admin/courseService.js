import { apiClient } from '../../utils/clientAxios';

export const courseService = {

  // Tạo khóa học mới
  createCourse: async (courseData) => {
    try {
      const response = await apiClient.post('/courses', courseData);
      return response.data;
    } catch (error) {
      console.error('Error creating course:', error);
      throw error;
    }
  },
  // Cập nhật khóa học
  updateCourse: async (id, courseData) => {
    try {
      const response = await apiClient.patch(`/courses/${id}`, courseData);
      return response.data;
    } catch (error) {
      console.error('Error updating course:', error);
      throw error;
    }
  },

  // Lấy danh sách khóa học
  getCourses: async () => {
    try {
      const response = await apiClient.get('/courses');
      return response.data;
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }
  },

  // Lấy chi tiết khóa học
  getCourseById: async (id) => {
    try {
      const response = await apiClient.get(`/admin/course/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching course:', error);
      throw error;
    }
  },

  // Lấy khóa học theo slug
  getCourseBySlug: async (slug) => {
    try {
      const response = await apiClient.get(`/courses/slug/${slug}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching course by slug:', error);
      throw error;
    }
  },

  // Lấy khóa học phổ biến
  getPopularCourses: async () => {
    try {
      const response = await apiClient.get('/admin/course/popular');
      return response.data;
    } catch (error) {
      console.error('Error fetching popular courses:', error);
      throw error;
    }
  },

  // Lấy khóa học miễn phí
  getFreeCourses: async () => {
    try {
      const response = await apiClient.get('/admin/course/free');
      return response.data;
    } catch (error) {
      console.error('Error fetching free courses:', error);
      throw error;
    }
  },

  // Lấy khóa học theo danh mục
  getCoursesByCategory: async (categoryId) => {
    try {
      const response = await apiClient.get(`/admin/course/category/${categoryId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching courses by category:', error);
      throw error;
    }
  },

  // Tìm kiếm khóa học
  searchCourses: async (query) => {
    try {
      const response = await apiClient.get('/admin/course/search', { 
        params: { q: query } 
      });
      return response.data;
    } catch (error) {
      console.error('Error searching courses:', error);
      throw error;
    }
  }
};