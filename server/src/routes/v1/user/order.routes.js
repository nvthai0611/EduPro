const express = require('express');
const router = express.Router();
const orderController = require('../../../controllers/v1/users/order.controller');
const authMiddleware = require('../../../middlewares/auth/v1/auth.middleware');

router.get('/', authMiddleware, orderController.getAllCheckouts);
router.get('/review/:checkoutId', authMiddleware, orderController.getAllProductHasReviewInCheckoutController);
router.post('/review-product', authMiddleware, orderController.reviewProductsBatchController);
module.exports = router;