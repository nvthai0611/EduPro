import { apiClient } from "../../utils/clientAxios";

export const getUserCheckouts = async () => {
  return await apiClient.get(`/users/orders`);
};

export const reviewProduct = async (checkoutId, reviews) => {
  return await apiClient.post(`/users/orders/review-product`, { checkoutId, reviews });
}


export const reviewProductInCheckout = async (checkoutId) => {
  return await apiClient.get(`/users/orders/review/${checkoutId}`);
}
