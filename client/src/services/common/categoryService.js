import { apiClient } from "../../utils/clientAxios";

// Lấy tất cả categories
export const getAllCategories = async () => {
  const response = await apiClient.get("/common/category");
  return response.data;
};

// Lấy category theo ID
export const getCategoryById = async (id) => {
  const response = await apiClient.get(`/common/category/${id}`);
  return response.data;
};

// Lấy services theo category ID
export const getServicesByCategory = async (categoryId) => {
  const response = await apiClient.get(`/common/category/services/category/${categoryId}`);
  console.log(response.data);
   return response.data;
};

// Lấy services theo category ID kèm review
export const getServicesByCategoryWithReview = async (categoryId) => {
  const response = await apiClient.get(`/common/category/services/category-with-review/${categoryId}`);
  return response.data;
}; 
