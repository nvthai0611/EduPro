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
      console.log('Original bannerData:', bannerData);
      const key = bannerData.key || 'homepage';
      
      // Nếu có file, tạo FormData để upload
      if (bannerData.image instanceof File) {
        const formData = new FormData()
        formData.append('image', bannerData.image)
        formData.append('title', bannerData.title)
        formData.append('description', bannerData.description || '')
        formData.append('linkUrl', bannerData.linkUrl)
        formData.append('isActive', bannerData.isActive)
        
        const response = await apiClient.post(`/admin/setting/${key}/slides`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        return response.data
      }
      
      // Nếu không có file, gửi data thông thường
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
      console.log('[bannersService] updateBanner called with id:', id, 'bannerData:', bannerData)
      console.log('[bannersService] bannerData.image instanceof File?', bannerData.image instanceof File)
      const key = bannerData.key || 'homepage';
      
      // CHỈ tạo FormData NẾU có file mới được chọn
      if (bannerData.image && bannerData.image instanceof File) {
        console.log('[bannersService] Creating FormData with NEW image file')
        const formData = new FormData()
        formData.append('image', bannerData.image)
        formData.append('title', bannerData.title)
        formData.append('description', bannerData.description || '')
        formData.append('linkUrl', bannerData.linkUrl)
        formData.append('isActive', String(bannerData.isActive))
        
        // Gửi publicId cũ để xóa ảnh cũ
        if (bannerData.oldPublicId) {
          console.log('[bannersService] Adding oldPublicId:', bannerData.oldPublicId)
          formData.append('oldPublicId', bannerData.oldPublicId)
        }
        
        console.log('[bannersService] Sending PUT request with FormData to:', `/admin/setting/${key}/slides/${id}`)
        const response = await apiClient.put(`/admin/setting/${key}/slides/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        console.log('[bannersService] Response:', response)
        return response.data
      }
      
      // Nếu KHÔNG có file mới, gửi JSON data thông thường (giữ nguyên imageUrl)
      console.log('[bannersService] Sending PUT request with JSON data (no new image)')
      const response = await apiClient.put(`/admin/setting/${key}/slides/${id}`, bannerData);   
      console.log('[bannersService] Response:', response)
        return response.data;
    } catch (error) {
      console.error('[bannersService] Error updating banner:', error);
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