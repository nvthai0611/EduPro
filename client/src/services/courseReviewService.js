import { apiClient } from '../utils/clientAxios';

const courseReviewService = {
  getReviewsByCourseSlug: async (slug) => {
    const res = await apiClient.get(`/reviews/course/${slug}`);
    return res.data;
  },

  createReview: async (data) => {
    return await apiClient.post("/reviews", data);
  },

  updateReview: async (reviewId, data) => {
    const res = await apiClient.patch(`/reviews/${reviewId}`, data);
    return res.data;
  },

  deleteReview: async (reviewId) => {
    return await apiClient.delete(`/reviews/${reviewId}`);
  },
};

export { courseReviewService };
export default courseReviewService;