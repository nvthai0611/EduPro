import { apiClient } from "../../utils/clientAxios";

// Lấy tất cả categories
export const getAllProducts = async () => {
    return await apiClient.get("/admin/product");
};

export const changeProductStatus = async (id, status) => {
    return await apiClient.patch(`/admin/product/${id}/status`, { status });
};

export const createProduct = async (data) => {
    return await apiClient.post("/admin/product", data, null, "multipart/form-data");
};

export const updateProduct = async (id, data) => {
    return await apiClient.put(`/admin/product/${id}`, data, null, "multipart/form-data");
};

export const getAllProductCategories = async () => {
    return await apiClient.get("/common/product/categories");
};
