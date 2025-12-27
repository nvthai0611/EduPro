import {apiClient} from '../../utils/clientAxios';

export const bannersService = {

  // Lấy danh sách banner
    getBanners: async (params) => {
    try {
      const response = await apiClient.get('/admin/banner', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching banners:', error);
      throw error;
    }   
    },
    // Tạo banner mới
    createBanner: async (bannerData) => {
    try {
      const response = await apiClient.post('/admin/banner', bannerData);
        return response.data;
    } catch (error) {
      console.error('Error creating banner:', error);
      throw error;
    }
    },
    // Cập nhật banner
    updateBanner: async (id, bannerData) => {
    try {
      const response = await apiClient.patch(`/admin/banners/${id}`, bannerData);   
        return response.data;
    } catch (error) {
      console.error('Error updating banner:', error);
      throw error;
    }
    },

    // Xóa banner   
    deleteBanner: async (id) => {
    try {
      const response = await apiClient.delete(`/admin/banners/${id}`);  
        return response.data;
    } catch (error) {
      console.error('Error deleting banner:', error);
      throw error;
    }
    },
};