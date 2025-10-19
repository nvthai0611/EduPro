const mongoose = require('mongoose');
const {
    getCartByUserId,
    addToCart,
    updateCart,
    removeFromCart,
    clearCart,
    mergeCartFromClient,
    checkoutSelectedItems,
    toggleItemSelection,
    selectAllItems,
    createPayosPaymentLink,
    handlePayosWebhook,
    getCheckoutByUserId
} = require('../../../services/userService/cart.service');
const User = require('../../../models/user.model');
const { successResponse, errorResponse } = require('../../../utils/response');

// Lấy giỏ hàng theo userId
const getCartByUserIdController = async (req, res) => {
    try {
        const userObject = await User.findById(req.user.UID);
        if (!userObject) {
            return errorResponse(res, {}, 404, 'User not found');
        }

        const result = await getCartByUserId(userObject._id);
        return successResponse(res, result, {}, 200, "Lấy giỏ hàng thành công");
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

// Thêm sản phẩm vào giỏ hàng
const addToCartController = async (req, res) => {
    try {
        const userObject = await User.findById(req.user.UID);
        if (!userObject || !userObject.isActive || !userObject.confirmEmail) {
            return errorResponse(res, {}, 400, 'User invalid or inactive');
        }

        const { productId, quantity } = req.body;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return errorResponse(res, {}, 400, 'Invalid Product ID');
        }
        if (quantity <= 0) {
            return errorResponse(res, {}, 400, 'Quantity must be greater than 0');
        }

        const result = await addToCart(userObject._id, productId, quantity);
        return successResponse(res, result, {}, 200, "Thêm sản phẩm vào giỏ hàng thành công");
    } catch (error) {
        console.log(error + "Lỗi add to cart");
        return errorResponse(res, "Lỗi add to cart: " + error.message, 500);
    }
};

// Cập nhật số lượng sản phẩm
const updateCartController = async (req, res) => {
    try {
        const userObject = await User.findById(req.user.UID);
        const { productId, quantity } = req.body;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return errorResponse(res, {}, 400, 'Invalid Product ID');
        }

        if (quantity <= 0) {
            return errorResponse(res, {}, 400, 'Quantity must be greater than 0');
        }

        const result = await updateCart(userObject._id, productId, quantity);
        return successResponse(res, result, {}, 200, "Cập nhật giỏ hàng thành công");
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

// Xóa sản phẩm khỏi giỏ hàng
const removeFromCartController = async (req, res) => {
    try {
        const userObject = await User.findById(req.user.UID);
        const { productId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return errorResponse(res, {}, 400, 'Invalid Product ID');
        }

        const result = await removeFromCart(userObject._id, productId);
        return successResponse(res, result, {}, 200, "Xóa sản phẩm khỏi giỏ hàng thành công");
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

// Xóa toàn bộ giỏ hàng
const clearCartController = async (req, res) => {
    try {
        const userObject = await User.findById(req.user.UID);
        const result = await clearCart(userObject._id);
        return successResponse(res, result, {}, 200, "Đã xóa toàn bộ giỏ hàng");
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

// Merge cart từ localStorage khi đăng nhập
const mergeCartController = async (req, res) => {
    try {
        const userObject = await User.findById(req.user.UID);
        const { localCartItems } = req.body;
        const result = await mergeCartFromClient(userObject._id, localCartItems);
        return successResponse(res, result, {}, 200, "Đồng bộ giỏ hàng từ localStorage thành công");
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

// Thanh toán các sản phẩm đã chọn (selected = true)
const checkoutController = async (req, res) => {
    try {
        const userObject = await User.findById(req.user.UID);
        const checkoutData = req.body;

        const result = await checkoutSelectedItems(userObject._id, checkoutData);
        return successResponse(res, result, {}, 200, "Thanh toán thành công");
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

const toggleItemSelectionController = async (req, res) => {
    try {
        const userObject = await User.findById(req.user.UID);
        const { productId } = req.body;

        const result = await toggleItemSelection(userObject._id, productId);
        return successResponse(res, result, {}, 200, "Đã thay đổi trạng thái chọn sản phẩm");
    } catch (error) {
        return errorResponse(res, {}, 500, error.message);
    }
};

const selectAllItemsController = async (req, res) => {
    try {
        const userObject = await User.findById(req.user.UID);
        const { selected } = req.body;

        const result = await selectAllItems(userObject._id, selected);
        return successResponse(res, result, {}, 200, "Đã thay đổi trạng thái chọn tất cả sản phẩm");
    } catch (error) {
        return errorResponse(res, error.message, 500, error.message);
    }
};

const getCheckoutByUserIdController = async (req, res) => {
    try {
        const { orderCode } = req.params;
        const userObject = await User.findById(req.user.UID);
        const result = await getCheckoutByUserId(userObject._id, orderCode);
        return successResponse(res, result, {}, 200, "Lấy giỏ hàng thanh cong");
    } catch (error) {
        return errorResponse(res, error.message, 500, error.message);
    }
}

// Controller tạo link thanh toán PayOS
const createPayosPaymentLinkController = async (req, res) => {
    try {
        const userObject = await User.findById(req.user.UID);
        const checkoutData = req.body.checkoutData;
        const payUrl = await createPayosPaymentLink(userObject._id, checkoutData);
        return successResponse(res, payUrl, {}, 200, "Tạo link thanh toán PayOS thanh cong");
    } catch (error) {
        console.log(error);

        return errorResponse(res, error.message, 500, error.message);
    }
};
//Controller webhook trả về PayOS
const handlePayosWebhookController = async (req, res) => {
    try {
        const result = await handlePayosWebhook(req.body);
        return successResponse(res, result, {}, 200, "Xử lý webhook PayOS thanh cong");
    } catch (error) {
        console.error("❌ Lỗi xử lý webhook PayOS:", error.message);

        // ✅ TRẢ VỀ 200 DÙ LỖI để ngăn PayOS tiếp tục gọi lại
        return res.status(200).json({
            message: "Đã nhận webhook nhưng có lỗi nội bộ",
            error: error.message
        });
    }
};



module.exports = {
    getCartByUserIdController,
    addToCartController,
    updateCartController,
    removeFromCartController,
    clearCartController,
    mergeCartController,
    checkoutController,
    toggleItemSelectionController,
    selectAllItemsController,
    createPayosPaymentLinkController,
    handlePayosWebhookController,
    getCheckoutByUserIdController
};
