const Review = require("../../models/review.model");
const Course = require("../../models/course.model");
const UserProgress = require("../../models/user_progress.model");
const { responseSuccess, responseError } = require("../../utils/response");

// POST /reviews - Add review
const addReview = async (req, res) => {
  try {
    const { courseId, rating, comment } = req.body;
    const userId = req.user.id;

    // Verify course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json(responseError("Không tìm thấy khóa học"));
    }

    // Check if user has purchased this course
    const canReview = await Review.canUserReview(userId, courseId);
    if (!canReview) {
      return res.status(403).json(responseError("Bạn cần mua khóa học để đánh giá"));
    }

    // Check if user already reviewed this course
    const existingReview = await Review.findOne({ userId, courseId });
    if (existingReview) {
      return res.status(400).json(responseError("Bạn đã đánh giá khóa học này rồi"));
    }

    // Create review
    const review = new Review({
      userId,
      courseId,
      rating: parseInt(rating),
      comment: comment?.trim(),
      isVerifiedPurchase: true,
    });

    await review.save();

    // Update course rating
    await updateCourseRating(courseId);

    // Populate user info
    await review.populate("userId", "fullName image");

    res.json(
      responseSuccess({
        review,
        message: "Đã thêm đánh giá thành công",
      })
    );
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json(responseError("Lỗi khi thêm đánh giá"));
  }
};

// PUT /reviews/:id - Update review
const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json(responseError("Không tìm thấy đánh giá"));
    }

    // Check if user owns this review
    if (review.userId.toString() !== userId) {
      return res.status(403).json(responseError("Bạn không có quyền chỉnh sửa đánh giá này"));
    }

    review.rating = parseInt(rating);
    review.comment = comment?.trim();
    review.isEdited = true;
    await review.save();

    // Update course rating
    await updateCourseRating(review.courseId);

    res.json(
      responseSuccess({
        review,
        message: "Đã cập nhật đánh giá",
      })
    );
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json(responseError("Lỗi khi cập nhật đánh giá"));
  }
};

// DELETE /reviews/:id - Delete review
const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json(responseError("Không tìm thấy đánh giá"));
    }

    // Check if user owns this review or is admin
    if (review.userId.toString() !== userId && req.user.role !== "admin") {
      return res.status(403).json(responseError("Bạn không có quyền xóa đánh giá này"));
    }

    const courseId = review.courseId;
    await Review.findByIdAndDelete(id);

    // Update course rating
    await updateCourseRating(courseId);

    res.json(responseSuccess({ message: "Đã xóa đánh giá" }));
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json(responseError("Lỗi khi xóa đánh giá"));
  }
};

// PUT /reviews/:id/like - Like/unlike review
const toggleReviewLike = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json(responseError("Không tìm thấy đánh giá"));
    }

    // Increment likes (in a real app, you'd track who liked what)
    await review.toggleLike();

    res.json(
      responseSuccess({
        reviewId: review._id,
        likes: review.likes,
        message: "Đã thích đánh giá",
      })
    );
  } catch (error) {
    console.error("Error toggling review like:", error);
    res.status(500).json(responseError("Lỗi khi thích đánh giá"));
  }
};

// GET /reviews/my - Get user's reviews
const getMyReviews = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const reviews = await Review.find({ userId })
      .populate("courseId", "title slug thumbnail")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Review.countDocuments({ userId });

    res.json(
      responseSuccess({
        reviews,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit)),
        },
      })
    );
  } catch (error) {
    console.error("Error getting my reviews:", error);
    res.status(500).json(responseError("Lỗi khi lấy đánh giá của tôi"));
  }
};

// Helper function to update course rating
const updateCourseRating = async (courseId) => {
  try {
    const ratingStats = await Review.aggregate([
      { $match: { courseId: courseId } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    if (ratingStats.length > 0) {
      const stats = ratingStats[0];
      await Course.findByIdAndUpdate(courseId, {
        rating: Math.round(stats.averageRating * 10) / 10,
        reviewCount: stats.totalReviews,
      });
    }
  } catch (error) {
    console.error("Error updating course rating:", error);
  }
};

module.exports = {
  addReview,
  updateReview,
  deleteReview,
  toggleReviewLike,
  getMyReviews,
};
