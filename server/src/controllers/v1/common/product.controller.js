const productService = require('../../../services/commonService/productService')
const { successResponse, errorResponse } = require('../../../utils/response');
const getAllProducts = async (req, res) => {
    try {
        const getAll = await productService.getAllProduct()
        if (!getAll) {
            return errorResponse(res, {}, 404, 'Không tìm thấy sản phẩm')
        }
        return successResponse(res, getAll, {}, 200, 'Lấy danh sách sản phẩm thành công')
    } catch (error) {
        console.log(error);
    }
}

const getAllCategories = async (req, res) => {
    try {
        const getAll = await productService.getAllCategoriesProduct()
        if (!getAll) {
            return errorResponse(res, {}, 404, 'Không tìm thấy danh sách danh mục')
        }
        return successResponse(res, getAll, {}, 200, 'Lấy danh sách danh mục thông')
    } catch (error) {
        console.log(error);
    }
}

const getAllReviewProduct = async (req, res) => {
    try {
        const getAll = await productService.getAllReviewProduct()
        if (!getAll) {
            return errorResponse(res, {}, 404, 'Không tìm thấy danh sách danh mục')
        }
        return successResponse(res, getAll, {}, 200, 'Lấy danh sách danh mục thông')
    } catch (error) {
        console.log(error);

    }
}

const getProductById = async (req, res) => {
    try {
        const { id } = req.params
        const product = await productService.getProductById(id)
        if (!product) {
            return errorResponse(res, {}, 404, 'Không tìm thấy sản phẩm')
        }
        return successResponse(res, product, {}, 200, 'Lấy sản phẩm thành công')
    } catch (error) {
        console.log(error);
    }
}

const getAllReviewProductById = async (req, res) => {
    try {
        const { id } = req.params
        const reviews = await productService.getAllReviewProductById(id)
        if (!reviews) {
            return errorResponse(res, {}, 404, 'Không tìm thấy đánh giá sản phẩm')
        }
        return successResponse(res, reviews, {}, 200, 'Lấy danh sách đánh giá sản phẩm thành công')
    } catch (error) {
        console.log(error);
    }
}

const getRelatedProductByCategory = async (req, res) => {
    try {
        const { id } = req.params
        const relatedProducts = await productService.getRelatedProductByCategory(id)
        if (!relatedProducts) {
            return errorResponse(res, {}, 404, 'Không tìm thấy sản phẩm liên quan')
        }
        return successResponse(res, relatedProducts, {}, 200, 'Lấy danh sách sản phẩm liên quan thành công')
    } catch (error) {
        console.log(error);
    }
}

const getAllProductById = async (req, res) => {
    try {
        const { id } = req.body
        const product = await productService.getAllProductById(id)
        if (!product) {
            return errorResponse(res, {}, 404, 'Không tìm thấy sản phẩm')
        }
        return successResponse(res, product, {}, 200, 'Lấy sản phẩm thành công')
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    getAllProducts,
    getAllCategories,
    getAllReviewProduct,
    getRelatedProductByCategory,
    getAllReviewProductById,
    getProductById,
    getAllProductById
}