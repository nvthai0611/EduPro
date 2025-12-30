import {apiClient} from '../../utils/clientAxios';

export const bannersService = {

  // Lấy danh sách banner
    getBanners: async (key = 'homepage') => {
    try {
      const response = await apiClient.get(`/setting/${key}/slides`);
      // console.log('Response from getBanners:', response);
      return response;
    } catch (error) {
      console.error('Error fetching banners:', error);
      throw error;
    }   
    },
  // Lấy danh sách banner cho admin
    getAdminBanners: async (params) => {
    try {
      const key = params.key || 'homepage';
      const response = await apiClient.get(`/admin/setting/${key}/slides`);
      return response.data;
    } catch (error) {
      console.error('Error fetching admin banners:', error);
      throw error;
    }
    },
    // Tạo banner mới
    createBanner: async (bannerData) => {
    try {
      const key = bannerData.key || 'homepage';
      const response = await apiClient.post(`/admin/setting/${key}/slides`, bannerData);
        return response.data;
    } catch (error) {
      console.error('Error creating banner:', error);
      throw error;
    }
    },
    // Cập nhật banner
    updateBanner: async (id, bannerData) => {
    try {
      const key = bannerData.key || 'homepage';
      const response = await apiClient.put(`/admin/setting/${key}/slides/${id}`, bannerData);   
        return response.data;
    } catch (error) {
      console.error('Error updating banner:', error);
      throw error;
    }
    },

    // Xóa banner   
    deleteBanner: async (id) => {
    try {
      const key = 'homepage'; // or pass in params
      const response = await apiClient.delete(`/admin/setting/${key}/slides/${id}`);  
        return response.data;
    } catch (error) {
      console.error('Error deleting banner:', error);
      throw error;
    }
    },
};