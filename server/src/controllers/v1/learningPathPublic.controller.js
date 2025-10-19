const LearningPath = require("../../models/learning_path.model");
const Course = require("../../models/course.model");
const { responseSuccess, responseError } = require("../../utils/response");

// GET /learning-paths - Browse learning paths
const getLearningPaths = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      level,
      search,
      sort = "newest",
    } = req.query;

    // Build filter object
    const filter = { isPublished: true };

    if (level) {
      filter.level = level;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
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
      case "duration":
        sortOptions = { estimatedDuration: 1 };
        break;
      default:
        sortOptions = { createdAt: -1 };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const learningPaths = await LearningPath.find(filter)
      .populate("courses.courseId", "title thumbnail price")
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await LearningPath.countDocuments(filter);

    // Add computed fields
    const pathsWithComputed = learningPaths.map((path) => ({
      ...path,
      url: `/learning-paths/${path.slug}`,
      totalCourses: path.courses.length,
      totalPrice: path.courses.reduce(
        (sum, courseItem) => sum + (courseItem.courseId?.price || 0),
        0
      ),
    }));

    res.json(
      responseSuccess({
        learningPaths: pathsWithComputed,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit)),
        },
      })
    );
  } catch (error) {
    console.error("Error getting learning paths:", error);
    res.status(500).json(responseError("Lỗi khi lấy danh sách lộ trình học"));
  }
};

// GET /learning-paths/:slug - Learning path detail
const getLearningPathDetail = async (req, res) => {
  try {
    const { slug } = req.params;

    const learningPath = await LearningPath.findOne({ slug, isPublished: true })
      .populate("courses.courseId", "title slug thumbnail price salePrice description totalLessons totalDuration")
      .lean();

    if (!learningPath) {
      return res.status(404).json(responseError("Không tìm thấy lộ trình học"));
    }

    // Sort courses by order
    const sortedCourses = learningPath.courses.sort((a, b) => a.order - b.order);

    // Get related learning paths
    const relatedPaths = await LearningPath.find({
      level: learningPath.level,
      _id: { $ne: learningPath._id },
      isPublished: true,
    })
      .select("title slug thumbnail level estimatedDuration")
      .limit(4)
      .lean();

    const pathWithComputed = {
      ...learningPath,
      url: `/learning-paths/${learningPath.slug}`,
      courses: sortedCourses.map((courseItem) => ({
        ...courseItem,
        course: {
          ...courseItem.courseId,
          currentPrice: courseItem.courseId?.salePrice || courseItem.courseId?.price,
          url: `/courses/${courseItem.courseId?.slug}`,
        },
      })),
      totalCourses: learningPath.courses.length,
      totalPrice: learningPath.courses.reduce(
        (sum, courseItem) => sum + (courseItem.courseId?.price || 0),
        0
      ),
      relatedPaths: relatedPaths.map((related) => ({
        ...related,
        url: `/learning-paths/${related.slug}`,
      })),
    };

    res.json(responseSuccess(pathWithComputed));
  } catch (error) {
    console.error("Error getting learning path detail:", error);
    res.status(500).json(responseError("Lỗi khi lấy chi tiết lộ trình học"));
  }
};

// GET /learning-paths/levels - Get available levels
const getLearningPathLevels = async (req, res) => {
  try {
    const levels = await LearningPath.distinct("level", { isPublished: true });
    
    const levelInfo = {
      beginner: "Người mới bắt đầu",
      intermediate: "Trung cấp",
      advanced: "Nâng cao",
    };

    const levelsWithInfo = levels.map((level) => ({
      value: level,
      label: levelInfo[level] || level,
      count: await LearningPath.countDocuments({ level, isPublished: true }),
    }));

    res.json(responseSuccess(levelsWithInfo));
  } catch (error) {
    console.error("Error getting learning path levels:", error);
    res.status(500).json(responseError("Lỗi khi lấy danh sách cấp độ"));
  }
};

module.exports = {
  getLearningPaths,
  getLearningPathDetail,
  getLearningPathLevels,
};
