import { apiClient } from '../utils/clientAxios';

export const articleService = {
  // Lấy article theo ID
  getArticleById: async (articleId) => {
    try {
      const response = await apiClient.get(`/admin/articles/${articleId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching article:', error);
      throw error;
    }
  },

  // Lấy articles theo section ID
  getArticlesBySection: async (sectionId) => {
    try {
      const response = await apiClient.get(`/admin/articles/section/${sectionId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching articles by section:', error);
      throw error;
    }
  },

  // Lấy article content cho user (published)
  getArticleContent: async (articleId) => {
    try {
      const response = await apiClient.get(`/articles/${articleId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching article content:', error);
      throw error;
    }
  },

  // Tạo article mới
  createArticle: async (articleData) => {
    try {
      const response = await apiClient.post('/admin/articles', articleData);
      return response.data;
    } catch (error) {
      console.error('Error creating article:', error);
      throw error;
    }
  },

  // Cập nhật article
  updateArticle: async (articleId, articleData) => {
    try {
      const response = await apiClient.patch(`/admin/articles/${articleId}`, articleData);
      return response.data;
    } catch (error) {
      console.error('Error updating article:', error);
      throw error;
    }
  },

  // Xóa article
  deleteArticle: async (articleId) => {
    try {
      const response = await apiClient.delete(`/admin/articles/${articleId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting article:', error);
      throw error;
    }
  },

  // Sắp xếp lại articles
  reorderArticles: async (sectionId, articleIds) => {
    try {
      const response = await apiClient.patch(`/admin/articles/section/${sectionId}/reorder`, {
        articleIds
      });
      return response.data;
    } catch (error) {
      console.error('Error reordering articles:', error);
      throw error;
    }
  },

  // Tìm kiếm articles
  searchArticles: async (query, courseId = null) => {
    try {
      const params = { query };
      if (courseId) params.courseId = courseId;
      
      const response = await apiClient.get('/admin/articles/search', { params });
      return response.data;
    } catch (error) {
      console.error('Error searching articles:', error);
      throw error;
    }
  }
};