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
    createBanner: async (bannerData, onUploadProgress) => {
    try {
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
          },
          onUploadProgress: (progressEvent) => {
            if (onUploadProgress && progressEvent.total) {
              const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              onUploadProgress(percentCompleted);
            }
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
    updateBanner: async (id, bannerData, onUploadProgress) => {
    try {
      const key = bannerData.key || 'homepage';
      
      // CHỈ tạo FormData NẾU có file mới được chọn
      if (bannerData.image && bannerData.image instanceof File) {
       const formData = new FormData()
        formData.append('image', bannerData.image)
        formData.append('title', bannerData.title)
        formData.append('description', bannerData.description || '')
        formData.append('linkUrl', bannerData.linkUrl)
        formData.append('isActive', String(bannerData.isActive))
        
        // Gửi publicId cũ để xóa ảnh cũ
        if (bannerData.oldPublicId) {
          formData.append('oldPublicId', bannerData.oldPublicId)
        }
        
        const response = await apiClient.put(`/admin/setting/${key}/slides/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: (progressEvent) => {
            if (onUploadProgress && progressEvent.total) {
              const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              onUploadProgress(percentCompleted);
            }
          }
        })
        return response.data
      }
      
      // Nếu KHÔNG có file mới, gửi JSON data với tất cả fields cần thiết
      const updateData = {
        title: bannerData.title,
        description: bannerData.description || '',
        linkUrl: bannerData.linkUrl,
        isActive: bannerData.isActive
      };
      
     const response = await apiClient.put(`/admin/setting/${key}/slides/${id}`, updateData);   
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
      console.error('Error deleting banner:');
      throw error;
    }
    },
};