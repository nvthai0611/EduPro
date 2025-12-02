import { apiClient } from '../../utils/clientAxios';

export const lessonService = {

  // ==================== CRUD Operations ====================
  
  // Tạo lesson mới
  createLesson: async (lessonData) => {
    try {
      const response = await apiClient.post('/admin/lessons', lessonData);
      return response.data;
    } catch (error) {
    //   console.error('Error creating lesson:', error);
      throw error;
    }
  },

  // Lấy danh sách lessons theo courseId
  getLessonsByCourseId: async (courseId) => {
    try {
      const response = await apiClient.get(`/admin/lessons/course/${courseId}`);
      return response.data;
    } catch (error) {
    //   console.error('Error fetching lessons by course:', error);
      throw error;
    }
  },

  // Lấy danh sách lessons theo sectionId
  getLessonsBySectionId: async (sectionId) => {
    try {
      const response = await apiClient.get(`/admin/lessons/section/${sectionId}`);
      return response.data;
    } catch (error) {
    //   console.error('Error fetching lessons by section:', error);
      throw error;
    }
  },

  // Lấy lesson theo ID
  getLessonById: async (lessonId) => {
    try {
      const response = await apiClient.get(`/admin/lessons/${lessonId}`);
      return response.data;
    } catch (error) {
    //   console.error('Error fetching lesson:', error);
      throw error;
    }
  },

  // Cập nhật lesson
  updateLesson: async (lessonId, lessonData) => {
    try {
      const response = await apiClient.patch(`/admin/lessons/${lessonId}`, lessonData);
      return response.data;
    } catch (error) {
    //   console.error('Error updating lesson:', error);
      throw error;
    }
  },

  // Xóa lesson (soft delete)
  deleteLesson: async (lessonId) => {
    try {
      const response = await apiClient.delete(`/admin/lessons/${lessonId}`);
      return response.data;
    } catch (error) {
    //   console.error('Error deleting lesson:', error);
      throw error;
    }
  },

  reorderLessons: async (sectionId, lessonIds) => {
    try {
      const response = await apiClient.patch(`/admin/lessons/section/${sectionId}/reorder`, {
        lessonIds // Array of lesson IDs in new order
      });
      return response.data;
    } catch (error) {
    //   console.error('Error reordering lessons:', error);
      throw error;
    }
  },

  // ==================== Video Upload ====================

  // TODO: Upload video to cloud storage
  // Uncomment when backend video upload is implemented
  /*
  uploadVideo: async (file, onUploadProgress) => {
    try {
      const formData = new FormData();
      formData.append('video', file);

      const response = await apiClient.post('/admin/lessons/upload-video', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onUploadProgress) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onUploadProgress(percentCompleted);
          }
        },
      });
      
      return response.data;
    } catch (error) {
      console.error('Error uploading video:', error);
      throw error;
    }
  },
  */

};

export default lessonService;
