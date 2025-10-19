const reviewService = require('../../../services/adminService/reviewService');
const { successResponse, errorResponse } = require('../../../utils/response');
const getAllReviews = async (req, res) => {
    try {
        const result = await reviewService.getAllReviews();
        successResponse(res, result, {}, 200, "Get all reviews successfully");
    } catch (err) {
        errorResponse(res, { message: err.message }, 500, "Failed to get reviews");
    }
};

// const getReviewById = async (req, res) => {
//     try {
//         const result = await reviewService.getReviewById(req.params.id);
//         res.json(result);
//     } catch (err) {
//         res.status(404).json({ message: err.message });
//     }
// };

const updateReview = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return errorResponse(res, { message: "Review ID is required" }, 400, "Invalid request");
        }
        const result = await reviewService.updateReview(id);
        successResponse(res, result, {}, 200, "Review updated successfully");
    } catch (err) {
        errorResponse(res, { message: err.message }, 404, "Failed to update review");
    }
};

const getAllReviewServiceController = async (req, res) => {
    try {
        const result = await reviewService.getAllReviewService();
        successResponse(res, result, {}, 200, "Get all reviews successfully");
    } catch (err) {
        errorResponse(res, { message: err.message }, 500, "Failed to get reviews");
    }
}

const updateReviewServiceController = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return errorResponse(res, { message: "Review ID is required" }, 400, "Invalid request");
        }
        const result = await reviewService.updateReviewService(id);
        successResponse(res, result, {}, 200, "Review updated successfully");
    } catch (err) {
        errorResponse(res, { message: err.message }, 404, "Failed to update review");
    }
}
module.exports = {
    // createReview,
    getAllReviews,
    // getReviewById,
    updateReview,
    getAllReviewServiceController,
    // deleteReview,
    updateReviewServiceController
};