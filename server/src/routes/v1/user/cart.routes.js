const express = require('express');
const router = express.Router();

const {
    getCartByUserIdController,
    addToCartController,
    updateCartController,
    removeFromCartController,
    clearCartController,
    mergeCartController,
    checkoutController,
    toggleItemSelectionController,
    selectAllItemsController,
    getCheckoutByUserIdController
} = require('../../../controllers/v1/users/cart.controller');
const authMiddleware = require('../../../middlewares/auth/v1/auth.middleware');

// Lấy giỏ hàng theo userId (đã xác thực)
router.get('/', authMiddleware, getCartByUserIdController);

// Thêm sản phẩm vào giỏ hàng
router.post('/add-to-cart', authMiddleware, addToCartController);

// Cập nhật số lượng sản phẩm
router.put('/update-cart', authMiddleware, updateCartController);

// Xóa sản phẩm khỏi giỏ hàng
router.delete('/remove-from-cart/:productId', authMiddleware, removeFromCartController);

// Xóa toàn bộ giỏ hàng
router.delete('/clear-cart', authMiddleware, clearCartController);

// Merge giỏ hàng từ localStorage
router.post('/merge-cart', authMiddleware, mergeCartController);

// Thanh toán các sản phẩm đã chọn
router.post('/checkout', authMiddleware, checkoutController);


//Chọn hoặc bỏ chọn sản phẩm trong giỏ hàng
router.post('/toggle-selection', authMiddleware, toggleItemSelectionController);

router.get('/checkout/:orderCode', authMiddleware, getCheckoutByUserIdController)

//Chọn hoặc bỏ hết sản phẩm 
router.post('/select-all', authMiddleware, selectAllItemsController);
module.exports = router;
