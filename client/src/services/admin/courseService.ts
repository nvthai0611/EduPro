import { apiClient } from '../../utils/clientAxios';

export const courseService = {
  // Lấy danh sách khóa học
  getCourses: async (params = {}) => {
    try {
      const response = await apiClient.get('/admin/course/all', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }
  },

  // Lấy chi tiết khóa học
  getCourseById: async (id: any) => {
    try {
      const response = await apiClient.get(`/admin/course/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching course:', error);
      throw error;
    }
  },

  // Lấy khóa học theo slug
  getCourseBySlug: async (slug: any) => {
    try {
      const response = await apiClient.get(`/admin/course/slug/${slug}`);
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
  getCoursesByCategory: async (categoryId: any) => {
    try {
      const response = await apiClient.get(`/admin/course/category/${categoryId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching courses by category:', error);
      throw error;
    }
  },

  // Tìm kiếm khóa học
  searchCourses: async (query: any) => {
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