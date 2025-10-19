import { apiClient } from "../../utils/clientAxios";

// Có thể có thêm các hàm khác
export const ratingAndFeedbackService = async (id, rating, comment, selectedOptions, bookingId, serviceRatings, staffRatings) => {
  const response = await apiClient.post(`/users/${id}/rating-and-feedback`, { rating, comment, selectedOptions, bookingId, serviceRatings, staffRatings });
  return response;
};
