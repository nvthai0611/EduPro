import { apiClient } from '../utils/clientAxios';

const progressService = {
  getProgress(courseId) {
    return apiClient.get(`/progress/${courseId}`);
  },

  markCompleted(courseId, lessonId) {
    return apiClient.post(
      `/progress/${courseId}/lessons/${lessonId}/complete`
    );
  },

  unmarkCompleted(courseId, lessonId) {
    return apiClient.delete(
      `/progress/${courseId}/lessons/${lessonId}/complete`
    );
  },
};

export default progressService;