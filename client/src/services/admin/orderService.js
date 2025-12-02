import { apiClient } from '../../utils/clientAxios';

export const orderService = {
  // Lấy danh sách khóa học đã mua của người dùng
  getPaidCourses: async () => {
    try {
      const response = await apiClient.get('/admin/order');
      return response;
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }
  },
};