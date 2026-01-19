import { apiClient } from "../../utils/clientAxios";


export const forumService = {
    // getall
    getAll: async () => {
    try {
      const response = await apiClient.get('/forum');
      // Handle nested response structure { success, data }
      if (response.data?.success && response.data?.data) {
        return response.data.data;
      }
      return response.data;
    } catch (error) {
      console.error('Error fetching forums:', error);
      throw error;
    }
    },
  // Lấy tất cả forum (dành cho admin)
  getAllForums: async () => {
    try {
      const response = await apiClient.get('/admin/forum');
      // Handle nested response structure { success, data }
      if (response.data?.success && response.data?.data) {
        return response.data.data;
      }
      return response.data;
    } catch (error) {
      console.error('Error fetching forums:', error);
      throw error;
    }   
    },
    // lấy chi tiết theo slug
    getForumBySlug: async (slug) => {
    try {
      const response = await apiClient.get(`/forum/slug/${slug}`);
      // Handle nested response structure { success, data }
      if (response.data?.success && response.data?.data) {
        return response.data.data;
      }
      return response.data;
    } catch (error) {
      console.error('Error fetching forum by slug:', error);
      throw error;
    }
    },
    // Tạo forum mới
    createForum: async (forumData) => {
    try {
      const response = await apiClient.post('/admin/forum', forumData);
        return response.data;
    } catch (error) {
      console.error('Error creating forum:', error);
      throw error;
    }
    },
    // Cập nhật forum
    updateForum: async (forumId, forumData) => {
    try {
      const response = await apiClient.patch(`/admin/forum/${forumId}`, forumData);
      return response.data;
    } catch (error) {
      console.error('Error updating forum:', error);
      throw error;
    }
    },
    // Xóa forum
    deleteForum: async (forumId) => {
    try {
        const response = await apiClient.delete(`/admin/forum/${forumId}`);
        return response.data;
    } catch (error) {
      console.error('Error deleting forum:', error);
      throw error;
    }
    },
};