const Review = require("../../models/review.model");
const Branch = require("../../models/branch.model");
const userModel = require("../../models/user.model");
const reviewService = require("../../models/serviceReview.model");


const getAllReviews = async () => {
    return await Review.find()
        .populate("branchId", "name")
        .populate("userId", "name email");
};

// const getReviewById = async (id) => {
//     const review = await Review.findById(id)
//         .populate("branchId", "name")
//         .populate("userId", "name email");
//     if (!review) throw new Error("Review not found");
//     return review;
// };

const updateReview = async (id) => {
    const review = await Review.findById(id);

    if (!review) {
        throw new Error("Review not found");
    }

    // Optional: Logic bảo vệ quyền update nếu cần

    review.status = !review.status; // Toggle status
    await review.save();

    const populatedReview = await Review.findById(id)
        .populate("branchId", "name")
        .populate("userId", "name email");

    return populatedReview;
};


const getAllReviewService = async () => {
    return await reviewService.find()
        .populate("branchId", "name")
        .populate("userId", "name email").populate("serviceId", "name");
};

const updateReviewService = async (id) => {
    const review = await reviewService.findById(id);

    if (!review) {
        throw new Error("Review not found");
    }

    // Optional: Logic bảo vệ quyền update nếu cần

    review.status = !review.status; // Toggle status
    await review.save();

    const populatedReview = await reviewService.findById(id)
        .populate("branchId", "name")
        .populate("userId", "name email").populate("serviceId", "name");

    return populatedReview;
};

module.exports = {
    getAllReviews,
    // getReviewById,
    updateReview,
    getAllReviewService,
    updateReviewService
};