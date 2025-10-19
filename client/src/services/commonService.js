import { apiClient } from '../utils/clientAxios'

const getAllReviews = async () => {
    return await apiClient.get('/common/review')
}

const getAllPositions = async () => {
    return await apiClient.get("/common/staff/position");
};

const getAllProduct = async () => {
    return await apiClient.get('/common/product')
}

const getAllProductCategories = async () => {
    return await apiClient.get('/common/product/categories')
}

const getAllReviewsProduct = async (id) => {
    return await apiClient.get(`/common/product/review-product-detail/${id}`)
}

const getProductById = async (id) => {
    return await apiClient.get(`/common/product/${id}`)
}

const getRelatedProductByCategory = async (productId) => {
    // lay product theo id roi lay category của product đó
    return await apiClient.get(`/common/product/related-product/${productId}`)
}
const getAllBranch = async () => {
    return await apiClient.get('/common/branch')
}
const getBranchById = async (id) => {
    return await apiClient.get(`/common/branch/${id}`)
}

const getStaffByBranch = async (branchId) => {
    return await apiClient.get(`/common/staff/branch/${branchId}`)
}

const getAllReviewService = async () => {
    return await apiClient.get('/common/review/by-service')
}

export {
    getAllReviews,
    getAllPositions,
    getAllProduct,
    getAllProductCategories,
    getRelatedProductByCategory,
    getAllReviewsProduct,
    getProductById,
    getAllBranch,
    getBranchById,
    getStaffByBranch,
    getAllReviewService
}