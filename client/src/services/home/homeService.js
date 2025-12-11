import { apiClient } from '../../utils/clientAxios';

export const homeService = {
  // Lấy thống kê tổng quan trang chủ
  getHomeStats: async () => {
    try {
      const response = await apiClient.get('/api/home/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching home stats:', error);
      // Fallback data nếu API lỗi
      return {
        totalCourses: 50,
        totalStudents: 10000,
        totalHours: 500,
        totalCertificates: 5000
      };
    }
  },

  // Lấy danh sách categories với số lượng khóa học
  getCategoriesWithCounts: async () => {
    try {
      const response = await apiClient.get('/api/home/categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Fallback data
      return [
        {
          name: "Frontend",
          slug: "frontend",
          count: 7,
          icon: "Globe",
          color: "text-blue-600 bg-blue-100",
        },
        {
          name: "Backend", 
          slug: "backend",
          count: 3,
          icon: "Database",
          color: "text-green-600 bg-green-100",
        },
        {
          name: "Mobile",
          slug: "mobile", 
          count: 1,
          icon: "Smartphone",
          color: "text-purple-600 bg-purple-100",
        },
        {
          name: "DevOps",
          slug: "devops",
          count: 1,
          icon: "Zap", 
          color: "text-orange-600 bg-orange-100",
        },
      ];
    }
  },

  // Lấy testimonials
  getTestimonials: async () => {
    try {
      const response = await apiClient.get('/api/home/testimonials');
      return response.data;
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      // Fallback data
      return [
        {
          name: 'Nguyễn Văn A',
          role: 'Frontend Developer',
          content: 'Khóa học React của Hoàng An IT rất chi tiết và dễ hiểu. Tôi đã có thể tự tin apply vào các công ty lớn.',
          rating: 5,
          avatar: 'https://i.pravatar.cc/?img=4'
        },
        {
          name: 'Trần Thị B',
          role: 'Fullstack Developer',
          content: 'Hệ thống học tập rất tốt, video chất lượng cao và có hỗ trợ 24/7. Rất đáng để đầu tư!',
          rating: 5,
          avatar: 'https://i.pravatar.cc/?img=5'
        },
        {
          name: 'Lê Văn C',
          role: 'Mobile Developer',
          content: 'Sau khi học khóa Flutter, tôi đã có thể tự phát triển ứng dụng mobile và kiếm được thu nhập tốt.',
          rating: 5,
          avatar: 'https://i.pravatar.cc/?img=11'
        }
      ];
    }
  }
};

