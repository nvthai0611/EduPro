const Course = require("../../models/course.model");
const Module = require("../../models/module.model");
const Lesson = require("../../models/lesson.model");
const Category = require("../../models/category.model");
const Review = require("../../models/review.model");
const { responseSuccess, responseError } = require("../../utils/response");

// GET /courses - Browse courses with filters
const getCourses = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      level,
      price,
      search,
      sort = "newest",
      featured,
    } = req.query;

    // Build filter object
    const filter = { isPublished: true };

    if (category) {
      filter.category = category;
    }

    if (level) {
      filter.level = level;
    }

    if (price === "free") {
      filter.price = 0;
    } else if (price === "paid") {
      filter.price = { $gt: 0 };
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (featured === "true") {
      filter.isFeatured = true;
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
      case "popular":
        sortOptions = { totalStudents: -1 };
        break;
      case "rating":
        sortOptions = { rating: -1 };
        break;
      case "price_low":
        sortOptions = { price: 1 };
        break;
      case "price_high":
        sortOptions = { price: -1 };
        break;
      default:
        sortOptions = { createdAt: -1 };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const courses = await Course.find(filter)
      .populate("category", "name")
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Course.countDocuments(filter);

    // Add computed fields
    const coursesWithComputed = courses.map((course) => ({
      ...course,
      currentPrice: course.salePrice || course.price,
      discountPercentage: course.salePrice
        ? Math.round(((course.price - course.salePrice) / course.price) * 100)
        : 0,
      url: `/courses/${course.slug}`,
    }));

    res.json(
      responseSuccess({
        courses: coursesWithComputed,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit)),
        },
      })
    );
  } catch (error) {
    console.error("Error getting courses:", error);
    res.status(500).json(responseError("Lỗi khi lấy danh sách khóa học"));
  }
};

// GET /courses/:slug - Course detail
const getCourseDetail = async (req, res) => {
  try {
    const { slug } = req.params;

    const course = await Course.findOne({ slug, isPublished: true })
      .populate("category", "name")
      .populate({
        path: "modules",
        populate: {
          path: "lessons",
          select: "title order videoDuration isFree",
        },
      })
      .lean();

    if (!course) {
      return res.status(404).json(responseError("Không tìm thấy khóa học"));
    }

    // Get course reviews
    const reviews = await Review.find({ courseId: course._id })
      .populate("userId", "fullName image")
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    // Get average rating
    const ratingStats = await Review.aggregate([
      { $match: { courseId: course._id } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    // Get related courses
    const relatedCourses = await Course.find({
      category: course.category._id,
      _id: { $ne: course._id },
      isPublished: true,
    })
      .select("title slug thumbnail price salePrice totalStudents rating")
      .limit(4)
      .lean();

    const courseWithComputed = {
      ...course,
      currentPrice: course.salePrice || course.price,
      discountPercentage: course.salePrice
        ? Math.round(((course.price - course.salePrice) / course.price) * 100)
        : 0,
      url: `/courses/${course.slug}`,
      ratingStats: ratingStats[0] || { averageRating: 5, totalReviews: 0 },
      reviews,
      relatedCourses: relatedCourses.map((related) => ({
        ...related,
        currentPrice: related.salePrice || related.price,
        url: `/courses/${related.slug}`,
      })),
    };

    res.json(responseSuccess(courseWithComputed));
  } catch (error) {
    console.error("Error getting course detail:", error);
    res.status(500).json(responseError("Lỗi khi lấy chi tiết khóa học"));
  }
};

// GET /courses/:slug/preview - Preview lessons
const getCoursePreview = async (req, res) => {
  try {
    const { slug } = req.params;

    const course = await Course.findOne({ slug, isPublished: true })
      .populate({
        path: "previewLessons",
        select: "title description videoUrl videoDuration order",
      })
      .lean();

    if (!course) {
      return res.status(404).json(responseError("Không tìm thấy khóa học"));
    }

    const previewLessons = course.previewLessons.map((lesson) => ({
      ...lesson,
      formattedDuration: `${Math.floor(lesson.videoDuration / 60)}:${(
        lesson.videoDuration % 60
      )
        .toString()
        .padStart(2, "0")}`,
    }));

    res.json(
      responseSuccess({
        course: {
          title: course.title,
          description: course.description,
          thumbnail: course.thumbnail,
          instructorName: course.instructorName,
        },
        previewLessons,
      })
    );
  } catch (error) {
    console.error("Error getting course preview:", error);
    res.status(500).json(responseError("Lỗi khi lấy preview khóa học"));
  }
};

// GET /courses/categories - Get course categories
const getCourseCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true })
      .select("name description")
      .lean();

    res.json(responseSuccess(categories));
  } catch (error) {
    console.error("Error getting categories:", error);
    res.status(500).json(responseError("Lỗi khi lấy danh mục khóa học"));
  }
};

module.exports = {
  getCourses,
  getCourseDetail,
  getCoursePreview,
  getCourseCategories,
};
