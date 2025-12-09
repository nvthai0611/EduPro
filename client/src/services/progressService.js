import { apiClient } from '../utils/clientAxios';

export const progressService = {
  // Lấy tiến độ học tập của user
  getUserProgress: async (userId) => {
    try {
      const response = await apiClient.get(`/api/v1/progress/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user progress:', error);
      throw error;
    }
  },

  // Lấy tiến độ của khóa học cụ thể
  getCourseProgress: async (courseId) => {
    try {
      const response = await apiClient.get(`/api/v1/progress/course/${courseId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching course progress:', error);
      throw error;
    }
  },

  // Cập nhật tiến độ bài học
  updateLessonProgress: async (lessonId, progressData) => {
    try {
      const response = await apiClient.post(`/api/v1/progress/lesson/${lessonId}`, progressData);
      return response.data;
    } catch (error) {
      console.error('Error updating lesson progress:', error);
      throw error;
    }
  },

  // Đánh dấu bài học đã hoàn thành
  markLessonCompleted: async (lessonId) => {
    try {
      const response = await apiClient.post(`/api/v1/progress/lesson/${lessonId}/complete`);
      return response.data;
    } catch (error) {
      console.error('Error marking lesson completed:', error);
      throw error;
    }
  },

  // Đánh dấu module đã hoàn thành
  markModuleCompleted: async (moduleId) => {
    try {
      const response = await apiClient.post(`/api/v1/progress/module/${moduleId}/complete`);
      return response.data;
    } catch (error) {
      console.error('Error marking module completed:', error);
      throw error;
    }
  },

  // Đánh dấu khóa học đã hoàn thành
  markCourseCompleted: async (courseId) => {
    try {
      const response = await apiClient.post(`/api/v1/progress/course/${courseId}/complete`);
      return response.data;
    } catch (error) {
      console.error('Error marking course completed:', error);
      throw error;
    }
  },

  // Lấy danh sách khóa học đã mua
  getPurchasedCourses: async () => {
    try {
      const response = await apiClient.get('/api/v1/progress/purchased-courses');
      return response.data;
    } catch (error) {
      console.error('Error fetching purchased courses:', error);
      throw error;
    }
  },

  // Lấy danh sách khóa học đang học
  getInProgressCourses: async () => {
    try {
      const response = await apiClient.get('/api/v1/progress/in-progress-courses');
      return response.data;
    } catch (error) {
      console.error('Error fetching in-progress courses:', error);
      throw error;
    }
  },

  // Lấy danh sách khóa học đã hoàn thành
  getCompletedCourses: async () => {
    try {
      const response = await apiClient.get('/api/v1/progress/completed-courses');
      return response.data;
    } catch (error) {
      console.error('Error fetching completed courses:', error);
      throw error;
    }
  },

  // Lấy thống kê học tập
  getLearningStats: async () => {
    try {
      const response = await apiClient.get('/api/v1/progress/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching learning stats:', error);
      throw error;
    }
  },

  // Lấy lịch sử học tập
  getLearningHistory: async (params = {}) => {
    try {
      const response = await apiClient.get('/api/v1/progress/history', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching learning history:', error);
      throw error;
    }
  },

  // Lưu bookmark bài học
  bookmarkLesson: async (lessonId) => {
    try {
      const response = await apiClient.post(`/api/v1/progress/lesson/${lessonId}/bookmark`);
      return response.data;
    } catch (error) {
      console.error('Error bookmarking lesson:', error);
      throw error;
    }
  },

  // Xóa bookmark bài học
  removeBookmark: async (lessonId) => {
    try {
      const response = await apiClient.delete(`/api/v1/progress/lesson/${lessonId}/bookmark`);
      return response.data;
    } catch (error) {
      console.error('Error removing bookmark:', error);
      throw error;
    }
  },

  // Lấy danh sách bookmark
  getBookmarks: async () => {
    try {
      const response = await apiClient.get('/api/v1/progress/bookmarks');
      return response.data;
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
      throw error;
    }
  },

  // Admin: Lấy tất cả tiến độ học viên
  getAllStudentProgress: async (params = {}) => {
    try {
      const response = await apiClient.get('/api/v1/progress/all', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching all student progress:', error);
      throw error;
    }
  },

  // Admin: Cấp chứng chỉ cho học viên
  issueCertificate: async (progressId) => {
    try {
      const response = await apiClient.post(`/api/v1/progress/${progressId}/certificate`);
      return response.data;
    } catch (error) {
      console.error('Error issuing certificate:', error);
      throw error;
    }
  }
};