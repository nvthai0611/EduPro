const LearningPath = require("../../models/learning_path.model");
const Course = require("../../models/course.model");
const { responseSuccess, responseError } = require("../../utils/response");

// GET /admin/learning-paths - Get all learning paths (admin)
const getLearningPaths = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      level,
      status,
      sort = "newest",
    } = req.query;

    // Build filter object
    const filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (level) {
      filter.level = level;
    }

    if (status !== undefined) {
      filter.isPublished = status === "published";
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
      case "title":
        sortOptions = { title: 1 };
        break;
      default:
        sortOptions = { createdAt: -1 };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const learningPaths = await LearningPath.find(filter)
      .populate("courses.courseId", "title slug thumbnail price")
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await LearningPath.countDocuments(filter);

    // Add computed fields
    const pathsWithComputed = learningPaths.map((path) => ({
      ...path,
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

// GET /admin/learning-paths/:id - Get learning path detail (admin)
const getLearningPathDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const learningPath = await LearningPath.findById(id)
      .populate("courses.courseId", "title slug thumbnail price salePrice")
      .lean();

    if (!learningPath) {
      return res.status(404).json(responseError("Không tìm thấy lộ trình học"));
    }

    // Sort courses by order
    const sortedCourses = learningPath.courses.sort((a, b) => a.order - b.order);

    const pathWithComputed = {
      ...learningPath,
      courses: sortedCourses,
      totalCourses: learningPath.courses.length,
      totalPrice: learningPath.courses.reduce(
        (sum, courseItem) => sum + (courseItem.courseId?.price || 0),
        0
      ),
    };

    res.json(responseSuccess(pathWithComputed));
  } catch (error) {
    console.error("Error getting learning path detail:", error);
    res.status(500).json(responseError("Lỗi khi lấy chi tiết lộ trình học"));
  }
};

// POST /admin/learning-paths - Create learning path
const createLearningPath = async (req, res) => {
  try {
    const {
      title,
      slug,
      description,
      thumbnail,
      courses,
      estimatedDuration,
      level,
      isPublished,
    } = req.body;

    // Check if slug already exists
    const existingPath = await LearningPath.findOne({ slug });
    if (existingPath) {
      return res.status(400).json(responseError("Slug đã tồn tại"));
    }

    // Verify all courses exist
    const courseIds = courses.map((course) => course.courseId);
    const coursesExist = await Course.find({ _id: { $in: courseIds } });
    if (coursesExist.length !== courseIds.length) {
      return res.status(400).json(responseError("Một số khóa học không tồn tại"));
    }

    const learningPath = new LearningPath({
      title,
      slug,
      description,
      thumbnail,
      courses,
      estimatedDuration,
      level,
      isPublished: isPublished || false,
    });

    await learningPath.save();

    // Populate courses for response
    await learningPath.populate("courses.courseId", "title slug thumbnail price");

    res.json(
      responseSuccess({
        learningPath,
        message: "Đã tạo lộ trình học thành công",
      })
    );
  } catch (error) {
    console.error("Error creating learning path:", error);
    res.status(500).json(responseError("Lỗi khi tạo lộ trình học"));
  }
};

// PUT /admin/learning-paths/:id - Update learning path
const updateLearningPath = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check if slug already exists (if being updated)
    if (updateData.slug) {
      const existingPath = await LearningPath.findOne({
        slug: updateData.slug,
        _id: { $ne: id },
      });
      if (existingPath) {
        return res.status(400).json(responseError("Slug đã tồn tại"));
      }
    }

    // Verify courses exist (if being updated)
    if (updateData.courses) {
      const courseIds = updateData.courses.map((course) => course.courseId);
      const coursesExist = await Course.find({ _id: { $in: courseIds } });
      if (coursesExist.length !== courseIds.length) {
        return res.status(400).json(responseError("Một số khóa học không tồn tại"));
      }
    }

    const learningPath = await LearningPath.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate("courses.courseId", "title slug thumbnail price");

    if (!learningPath) {
      return res.status(404).json(responseError("Không tìm thấy lộ trình học"));
    }

    res.json(
      responseSuccess({
        learningPath,
        message: "Đã cập nhật lộ trình học thành công",
      })
    );
  } catch (error) {
    console.error("Error updating learning path:", error);
    res.status(500).json(responseError("Lỗi khi cập nhật lộ trình học"));
  }
};

// DELETE /admin/learning-paths/:id - Delete learning path
const deleteLearningPath = async (req, res) => {
  try {
    const { id } = req.params;

    const learningPath = await LearningPath.findById(id);
    if (!learningPath) {
      return res.status(404).json(responseError("Không tìm thấy lộ trình học"));
    }

    await LearningPath.findByIdAndDelete(id);

    res.json(responseSuccess({ message: "Đã xóa lộ trình học thành công" }));
  } catch (error) {
    console.error("Error deleting learning path:", error);
    res.status(500).json(responseError("Lỗi khi xóa lộ trình học"));
  }
};

// PUT /admin/learning-paths/:id/courses/reorder - Reorder courses in learning path
const reorderCourses = async (req, res) => {
  try {
    const { id } = req.params;
    const { courses } = req.body; // Array of { courseId, order, isRequired }

    const learningPath = await LearningPath.findById(id);
    if (!learningPath) {
      return res.status(404).json(responseError("Không tìm thấy lộ trình học"));
    }

    // Update courses with new order
    learningPath.courses = courses.map((course, index) => ({
      courseId: course.courseId,
      order: course.order || index + 1,
      isRequired: course.isRequired !== undefined ? course.isRequired : true,
    }));

    await learningPath.save();

    await learningPath.populate("courses.courseId", "title slug thumbnail price");

    res.json(
      responseSuccess({
        learningPath,
        message: "Đã sắp xếp lại thứ tự khóa học",
      })
    );
  } catch (error) {
    console.error("Error reordering courses:", error);
    res.status(500).json(responseError("Lỗi khi sắp xếp lại thứ tự khóa học"));
  }
};

// POST /admin/learning-paths/:id/courses - Add course to learning path
const addCourseToPath = async (req, res) => {
  try {
    const { id } = req.params;
    const { courseId, order, isRequired = true } = req.body;

    const learningPath = await LearningPath.findById(id);
    if (!learningPath) {
      return res.status(404).json(responseError("Không tìm thấy lộ trình học"));
    }

    // Check if course already in path
    const existingCourse = learningPath.courses.find(
      (course) => course.courseId.toString() === courseId
    );
    if (existingCourse) {
      return res.status(400).json(responseError("Khóa học đã có trong lộ trình"));
    }

    // Verify course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json(responseError("Không tìm thấy khóa học"));
    }

    // Add course to path
    const newOrder = order || learningPath.courses.length + 1;
    learningPath.courses.push({
      courseId,
      order: newOrder,
      isRequired,
    });

    await learningPath.save();

    await learningPath.populate("courses.courseId", "title slug thumbnail price");

    res.json(
      responseSuccess({
        learningPath,
        message: "Đã thêm khóa học vào lộ trình",
      })
    );
  } catch (error) {
    console.error("Error adding course to path:", error);
    res.status(500).json(responseError("Lỗi khi thêm khóa học vào lộ trình"));
  }
};

module.exports = {
  getLearningPaths,
  getLearningPathDetail,
  createLearningPath,
  updateLearningPath,
  deleteLearningPath,
  reorderCourses,
  addCourseToPath,
};
