const productModel = require('../../models/product.model')
const categoryModel = require('../../models/product_category.model')
const reviewProductModel = require('../../models/review_product.model')
const getAllProduct = async () => {
    const getAll = await productModel.find({ status: true }).populate({
        path: 'category',
        select: '_id'
    }).sort({ new: -1, createdAt: -1 })

    if (getAll.length < 0) {
        const error = new Error('Không tìm thấy sản phẩm')
        error.status = 404
        throw error

    }
    return getAll
}

const getAllCategoriesProduct = async () => {
    try {
        const getAll = await categoryModel.find()
        if (getAll.length < 0) {
            const error = new Error('Không tìm thấy danh sách danh mục')
            error.status = 404
            throw error
        }
        return getAll
    } catch (error) {
        console.log(error);
    }
}

const getAllReviewProduct = async () => {
    try {
        const getAll = await reviewProductModel.find({ status: true }).populate('product').populate('user')
        if (getAll.length < 0) {
            const error = new Error('Không tìm thấy danh sách đánh giá sản phẩm')
            error.status = 404
            throw error
        }
        return getAll
    } catch (error) {
        console.log(error);

    }
}

const getProductById = async (id) => {
    const product = await productModel.findById({ _id: id, status: true }).populate('category')

    if (!product) {
        const error = new Error('Không tìm thấy sản phẩm')
        error.status = 404
        throw error
    }
    return product
}

const getAllReviewProductById = async (id) => {
    const reviews = await reviewProductModel.find({ product: id, status: true }).populate('user')
    if (!reviews) {
        const error = new Error('Không tìm thấy đánh giá sản phẩm')
        error.status = 404
        throw error
    }
    return reviews
}

const getRelatedProductByCategory = async (productId) => {
    try {
        const product = await productModel.findById(productId)
        if (!product) {
            const error = new Error('Không tìm thấy sản phẩm')
            error.status = 404
            throw error
        }
        const relatedProducts = await productModel.find({ category: product.category, status: true }).populate('category')
        if (relatedProducts.length < 0) {
            const error = new Error('Không tìm thấy sản phẩm liên quan')
            error.status = 404
            throw error
        }
        return relatedProducts
    } catch (error) {
        console.log(error);
    }
}

const getAllProductById = (id) => {
    return productModel.find({ "_id": { "$in": id }, status: true }).populate('category');
}


module.exports = {
    getAllProduct,
    getAllCategoriesProduct,
    getAllReviewProduct,
    getProductById,
    getAllReviewProductById,
    getRelatedProductByCategory,
    getAllProductById
}
