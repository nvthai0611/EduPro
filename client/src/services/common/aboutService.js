import { apiClient } from "../../utils/clientAxios";

export const getAverageRating = async () => {
  try {
    const response = await apiClient.get("/common/about/average-rating");
    if (response && (response.averageRating !== undefined || response.count !== undefined)) {
      return response;
    }
    if (response && response.data) {
      return response.data;
    }
    return {};
  } catch (err) {
    return {};
  }
};