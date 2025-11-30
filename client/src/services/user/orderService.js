import { apiClient } from "../../utils/clientAxios";

export const createOrder = async (data) => {
  return await apiClient.post(`/orders`, data);
};

export const checkPurchase = async (userId, courseId) => {
  return await apiClient.get(`/orders/check?userId=${userId}&courseId=${courseId}`);
}

export const markAsPaid = async (orderId) => {
  return await apiClient.post(`/orders/mark-paid`, {orderId: orderId});
}
