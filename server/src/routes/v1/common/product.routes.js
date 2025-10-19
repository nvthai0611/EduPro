const { getAllProducts, getAllCategories, getAllReviewProduct, getProductById, getAllReviewProductById, getRelatedProductByCategory, getAllProductById } = require('../../../controllers/v1/common/product.controller')
const express = require("express");
const router = express.Router();

router.get('/', getAllProducts)
router.get('/categories', getAllCategories)
router.get('/review-product', getAllReviewProduct)
router.get('/:id', getProductById) // This route is for getting a product by ID, but it should be handled in the controller
router.get('/review-product-detail/:id', getAllReviewProductById) // This route is for getting reviews of a product by product ID
router.get('/related-product/:id', getRelatedProductByCategory)
router.get('/all-product-by-id', getAllProductById)
module.exports = router