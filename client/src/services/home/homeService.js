// src/services/categoryService.js
import { apiClient } from "../../utils/clientAxios";

export const getAllCategories = async () => {
  const response = await apiClient.get("/categories");
  return response.data; 
};

