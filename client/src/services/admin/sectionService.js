import { apiClient } from '../../utils/clientAxios';

export const sectionService = {

  createSection: async (sectionData) => {
    try {
      const response = await apiClient.post('/admin/sections', sectionData);
      return response.data;
    } catch (error) {
      console.error('Error creating section:', error);
    }
  },

  getSectionsByCourseId: async (courseId) => {
    try {
      const response = await apiClient.get(`/admin/sections/course/${courseId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching sections:', error);
    }
  },

  // Lấy sections kèm lessons (populated)
  getSectionsWithLessons: async (courseId) => {
    try {
      const response = await apiClient.get(`/admin/sections/course/${courseId}/with-lessons`);
      return response;
    } catch (error) {
      console.error('Error fetching sections with lessons:', error);
    }
  },

  // Lấy section theo ID
  getSectionById: async (sectionId) => {
    try {
      const response = await apiClient.get(`/admin/sections/${sectionId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching section:', error);
    }
  },

  // Cập nhật section
  updateSection: async (sectionId, sectionData) => {
    try {
      const response = await apiClient.patch(`/admin/sections/${sectionId}`, sectionData);
      return response.data;
    } catch (error) {
      console.error('Error updating section:', error);
    }
  },

  // Xóa section (soft delete)
  deleteSection: async (sectionId) => {
    try {
      const response = await apiClient.delete(`/admin/sections/${sectionId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting section:', error);
    }
  },

  // ==================== Section-Lesson Relationship ====================

  // Thêm lesson vào section
  addLessonToSection: async (sectionId, lessonId) => {
    try {
      const response = await apiClient.post(`/admin/sections/${sectionId}/lessons`, {
        lessonId
      });
      return response.data;
    } catch (error) {
      console.error('Error adding lesson to section:', error);
    }
  },

  // Xóa lesson khỏi section
  removeLessonFromSection: async (sectionId, lessonId) => {
    try {
      const response = await apiClient.delete(`/admin/sections/${sectionId}/lessons`, {
        data: { lessonId }
      });
      return response.data;
    } catch (error) {
      console.error('Error removing lesson from section:', error);
    }
  },

  // ==================== Reordering ====================

  // Sắp xếp lại thứ tự sections trong course
  reorderSections: async (courseId, sectionIds) => {
    try {
      const response = await apiClient.patch(`/admin/sections/course/${courseId}/reorder`, {
        sectionIds // Array of section IDs in new order
      });
      return response.data;
    } catch (error) {
      console.error('Error reordering sections:', error);
    }
  },

};

export default sectionService;
