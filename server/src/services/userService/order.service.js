const Checkout = require('../../models/checkout.model');
const reviewProductModel = require('../../models/review_product.model');
const getAllCheckout = async (userId) => {
    const checkouts = await Checkout.find({ UserId: userId }).sort({ createdAt: -1 }).populate('items.product');
    return checkouts;
};

const reviewProductsBatch = async (userId, checkoutId, reviewsData) => {
    if (!Array.isArray(reviewsData) || reviewsData.length === 0) {
        throw new Error('Dữ liệu đánh giá không hợp lệ.');
    }

    const results = [];
    for (const review of reviewsData) {
        try {
            // Validate individual review data (basic check)
            if (!review.productId || review.rating === undefined || review.rating < 1 || review.rating > 5) {
                results.push({
                    productId: review.productId,
                    status: 'failed',
                    message: 'Thiếu thông tin hoặc định dạng đánh giá không hợp lệ cho sản phẩm này.'
                });
                continue; // Skip to next review
            }

            // Call your existing single review logic
            const result = await reviewProduct(userId, review.productId, checkoutId, review.rating, review.comment);
            results.push({ productId: review.productId, status: 'success', data: result });
        } catch (error) {
            console.error(`Lỗi khi xử lý đánh giá cho sản phẩm ${review.productId}:`, error.message);
            results.push({ productId: review.productId, status: 'failed', message: error.message || 'Lỗi không xác định.' });
        }
    }
    console.log(results);

    return results;
};

const reviewProduct = async (userId, productId, checkoutId, rating, comment) => {
    try {
        // Kiểm tra xem đơn hàng có tồn tại và thuộc về người dùng không
        const checkout = await Checkout.findOne({ _id: checkoutId, UserId: userId });
        if (!checkout) {
            throw new Error('Đơn hàng không tồn tại hoặc không thuộc về người dùng này.');
        }

        // Kiểm tra xem sản phẩm có trong đơn hàng này không
        const productInCheckout = checkout.items.some(item => item.product.toString() === productId);
        if (!productInCheckout) {
            throw new Error('Sản phẩm không thuộc đơn hàng này.');
        }

        // Logic bạn đã cung cấp: Tìm và cập nhật nếu đã có, hoặc tạo mới
        const existingReview = await reviewProductModel.findOneAndUpdate(
            { user: userId, product: productId, checkout: checkoutId },
            { rating, comment, updatedAt: Date.now() },
            { new: true, upsert: true } // `upsert: true` sẽ tạo mới nếu không tìm thấy
        );

        // Tùy chọn: Cập nhật rating trung bình của sản phẩm (nếu có)
        // Đây là một ví dụ, bạn cần tự triển khai logic này nếu muốn
        // if (existingReview) {
        //     await updateProductAverageRating(productId);
        // }

        return existingReview;
    } catch (error) {
        console.error("Lỗi trong reviewProduct service:", error);
        throw error;
    }
};

const getAllProductHasReviewInCheckout = async (checkoutId) => {
    try {
        const products = await reviewProductModel.find({ checkout: checkoutId });
        return products;
    } catch (error) {
        console.error("Lỗi trong getAllProductHasReviewInCheckout service:", error);
        throw error;
    }
}
module.exports = {
    getAllCheckout,
    reviewProductsBatch,
    getAllProductHasReviewInCheckout
};
