import { apiClient } from "../../utils/clientAxios";

// Có thể có thêm các hàm khác
export const getAllPromotions = async () => {
  const response = await apiClient.get(`/common/promotions`);
  return response.data;
};
