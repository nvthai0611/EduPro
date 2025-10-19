const orderService = require('../../../services/userService/order.service');
const { successResponse, errorResponse } = require('../../../utils/response');

const getAllCheckouts = async (req, res) => {
    try {
        const userId = req.user.UID;
        const checkouts = await orderService.getAllCheckout(userId);

        if (!checkouts || checkouts.length === 0) {
            return errorResponse(res, {}, 404, 'Không tìm thấy đơn hàng');
        }

        return successResponse(res, checkouts, {}, 200, 'Lấy danh sách đơn hàng thành công');
    } catch (error) {
        console.log(error);
        return errorResponse(res, {}, 500, 'Lỗi server');
    }
};

const reviewProductsBatchController = async (req, res) => {
    try {
        const userId = req.user.UID; // Lấy userId từ req.user (do middleware xác thực cung cấp)
        const { checkoutId, reviews } = req.body; // **Nhận mảng 'reviews' từ body**

        // Basic validation
        if (!checkoutId || !reviews || !Array.isArray(reviews) || reviews.length === 0) {
            return errorResponse(res, {}, 400, 'Dữ liệu đánh giá không hợp lệ. Vui lòng cung cấp checkoutId và một mảng reviews.');
        }

        // Gọi hàm service reviewProductsBatch để xử lý nhiều đánh giá
        const result = await orderService.reviewProductsBatch(userId, checkoutId, reviews);

        // Đếm số lượng đánh giá thành công/thất bại để trả về thông báo chi tiết hơn
        const successfulReviews = result.filter(r => r.status === 'success').length;
        const failedReviews = result.filter(r => r.status === 'failed').length;

        let message = `Hoàn thành xử lý đánh giá: ${successfulReviews} thành công, ${failedReviews} thất bại.`;
        if (failedReviews > 0) {
            return successResponse(res, result, {}, 200, message); // Vẫn trả về 200 OK nếu có một số thành công, nhưng kèm theo thông báo lỗi
        }

        return successResponse(res, result, {}, 200, message);
    } catch (error) {
        console.error("Lỗi trong reviewProductsBatchController:", error); // Ghi log lỗi
        return errorResponse(res, {}, 500, error.message || 'Lỗi server khi gửi đánh giá.'); // Trả về lỗi chi tiết cho client
    }
};

const getAllProductHasReviewInCheckoutController = async (req, res) => {
    try {
        const checkoutId = req.params.checkoutId;
        const result = await orderService.getAllProductHasReviewInCheckout(checkoutId);
        return successResponse(res, result, {}, 200, 'Lấy danh sách sản phẩm đã đánh giá');
    } catch (error) {
        console.log(error);
        return errorResponse(res, {}, 500, 'Lỗi server');
    }
};

module.exports = {
    getAllCheckouts,
    reviewProductsBatchController,
    getAllProductHasReviewInCheckoutController
};
