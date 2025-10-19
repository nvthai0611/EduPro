const Review = require("../../models/review.model");
const Course = require("../../models/course.model");
const { responseSuccess, responseError } = require("../../utils/response");

// GET /reviews/:courseId - Get course reviews
const getCourseReviews = async (req, res) => {
  try {
    const { courseId } = req.params;
    const {
      page = 1,
      limit = 10,
      sort = "newest",
    } = req.query;

    // Verify course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json(responseError("Không tìm thấy khóa học"));
    }

    // Build sort object
    let sortOptions = {};
    switch (sort) {
      case "newest":
        sortOptions = { createdAt: -1 };
        break;
      case "oldest":
        sortOptions = { createdAt: 1 };
        break;
      case "highest":
        sortOptions = { rating: -1 };
        break;
      case "lowest":
        sortOptions = { rating: 1 };
        break;
      case "most_liked":
        sortOptions = { likes: -1 };
        break;
      default:
        sortOptions = { createdAt: -1 };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const reviews = await Review.find({ courseId })
      .populate("userId", "fullName image")
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Review.countDocuments({ courseId });

    // Get rating statistics
    const ratingStats = await Review.aggregate([
      { $match: { courseId: course._id } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
          ratingDistribution: {
            $push: "$rating",
          },
        },
      },
    ]);

    // Calculate rating distribution
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    if (ratingStats[0]?.ratingDistribution) {
      ratingStats[0].ratingDistribution.forEach((rating) => {
        distribution[rating] = (distribution[rating] || 0) + 1;
      });
    }

    const stats = ratingStats[0] || { averageRating: 0, totalReviews: 0 };

    res.json(
      responseSuccess({
        reviews,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit)),
        },
        ratingStats: {
          averageRating: Math.round(stats.averageRating * 10) / 10,
          totalReviews: stats.totalReviews,
          distribution,
        },
      })
    );
  } catch (error) {
    console.error("Error getting course reviews:", error);
    res.status(500).json(responseError("Lỗi khi lấy đánh giá khóa học"));
  }
};

// GET /reviews/stats/:courseId - Get course rating statistics only
const getCourseRatingStats = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Verify course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json(responseError("Không tìm thấy khóa học"));
    }

    // Get rating statistics
    const ratingStats = await Review.aggregate([
      { $match: { courseId: course._id } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
          ratingDistribution: {
            $push: "$rating",
          },
        },
      },
    ]);

    // Calculate rating distribution
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    if (ratingStats[0]?.ratingDistribution) {
      ratingStats[0].ratingDistribution.forEach((rating) => {
        distribution[rating] = (distribution[rating] || 0) + 1;
      });
    }

    const stats = ratingStats[0] || { averageRating: 0, totalReviews: 0 };

    res.json(
      responseSuccess({
        averageRating: Math.round(stats.averageRating * 10) / 10,
        totalReviews: stats.totalReviews,
        distribution,
      })
    );
  } catch (error) {
    console.error("Error getting course rating stats:", error);
    res.status(500).json(responseError("Lỗi khi lấy thống kê đánh giá"));
  }
};

module.exports = {
  getCourseReviews,
  getCourseRatingStats,
};
