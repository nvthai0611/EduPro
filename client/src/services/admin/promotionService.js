import { apiClient } from "../../utils/clientAxios";

export const getAllPromotions = async () => {
  return await apiClient.get("/admin/promotion");
};

export const getPromotionById = async (id) => {
  return await apiClient.get(`/admin/promotion/${id}`);
};

export const setPromotionActiveStatus = async (id, isActive) => {
  return await apiClient.patch(`/admin/promotion/${id}/status`, { isActive: isActive });
};

export const createPromotion = async (data) => {
return await apiClient.post("/admin/promotion", data);
};

export const updatePromotion = async (id, data) => {
  return await apiClient.put(`/admin/promotion/${id}`, data);
};
