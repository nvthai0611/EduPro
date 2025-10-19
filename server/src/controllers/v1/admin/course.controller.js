const Course = require("../../models/course.model");
const Module = require("../../models/module.model");
const Lesson = require("../../models/lesson.model");
const Category = require("../../models/category.model");
const { responseSuccess, responseError } = require("../../utils/response");

// GET /admin/courses - Get all courses (admin)
const getCourses = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      category,
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

    if (category) {
      filter.category = category;
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

    const courses = await Course.find(filter)
      .populate("category", "name")
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Course.countDocuments(filter);

    res.json(
      responseSuccess({
        courses,
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

// GET /admin/courses/:id - Get course detail (admin)
const getCourseDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id)
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

    res.json(responseSuccess(course));
  } catch (error) {
    console.error("Error getting course detail:", error);
    res.status(500).json(responseError("Lỗi khi lấy chi tiết khóa học"));
  }
};

// POST /admin/courses - Create course
const createCourse = async (req, res) => {
  try {
    const {
      title,
      slug,
      description,
      thumbnail,
      category,
      level,
      price,
      salePrice,
      isPublished,
      isFeatured,
      whatYouWillLearn,
      requirements,
      targetAudience,
    } = req.body;

    // Check if slug already exists
    const existingCourse = await Course.findOne({ slug });
    if (existingCourse) {
      return res.status(400).json(responseError("Slug đã tồn tại"));
    }

    // Verify category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json(responseError("Danh mục không tồn tại"));
    }

    const course = new Course({
      title,
      slug,
      description,
      thumbnail,
      category,
      level,
      price,
      salePrice,
      isPublished: isPublished || false,
      isFeatured: isFeatured || false,
      whatYouWillLearn: whatYouWillLearn || [],
      requirements: requirements || [],
      targetAudience: targetAudience || [],
      modules: [],
    });

    await course.save();

    res.json(
      responseSuccess({
        course,
        message: "Đã tạo khóa học thành công",
      })
    );
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json(responseError("Lỗi khi tạo khóa học"));
  }
};

// PUT /admin/courses/:id - Update course
const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check if slug already exists (if being updated)
    if (updateData.slug) {
      const existingCourse = await Course.findOne({
        slug: updateData.slug,
        _id: { $ne: id },
      });
      if (existingCourse) {
        return res.status(400).json(responseError("Slug đã tồn tại"));
      }
    }

    // Verify category exists (if being updated)
    if (updateData.category) {
      const categoryExists = await Category.findById(updateData.category);
      if (!categoryExists) {
        return res.status(400).json(responseError("Danh mục không tồn tại"));
      }
    }

    const course = await Course.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!course) {
      return res.status(404).json(responseError("Không tìm thấy khóa học"));
    }

    res.json(
      responseSuccess({
        course,
        message: "Đã cập nhật khóa học thành công",
      })
    );
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json(responseError("Lỗi khi cập nhật khóa học"));
  }
};

// DELETE /admin/courses/:id - Delete course
const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json(responseError("Không tìm thấy khóa học"));
    }

    // Delete associated modules and lessons
    await Module.deleteMany({ courseId: id });
    await Lesson.deleteMany({ courseId: id });

    // Delete course
    await Course.findByIdAndDelete(id);

    res.json(responseSuccess({ message: "Đã xóa khóa học thành công" }));
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json(responseError("Lỗi khi xóa khóa học"));
  }
};

// POST /admin/courses/:id/modules - Add module to course
const addModule = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, order } = req.body;

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json(responseError("Không tìm thấy khóa học"));
    }

    const module = new Module({
      courseId: id,
      title,
      description,
      order: order || (await Module.countDocuments({ courseId: id })) + 1,
    });

    await module.save();

    // Add module to course
    course.modules.push(module._id);
    await course.save();

    res.json(
      responseSuccess({
        module,
        message: "Đã thêm module thành công",
      })
    );
  } catch (error) {
    console.error("Error adding module:", error);
    res.status(500).json(responseError("Lỗi khi thêm module"));
  }
};

// POST /admin/modules/:id/lessons - Add lesson to module
const addLesson = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      videoUrl,
      videoDuration,
      isFree,
      resources,
      order,
    } = req.body;

    const module = await Module.findById(id);
    if (!module) {
      return res.status(404).json(responseError("Không tìm thấy module"));
    }

    const lesson = new Lesson({
      moduleId: id,
      courseId: module.courseId,
      title,
      description,
      videoUrl,
      videoDuration,
      isFree: isFree || false,
      resources: resources || [],
      order: order || (await Lesson.countDocuments({ moduleId: id })) + 1,
    });

    await lesson.save();

    // Add lesson to module
    module.lessons.push(lesson._id);
    await module.save();

    // Update course stats
    await updateCourseStats(module.courseId);

    res.json(
      responseSuccess({
        lesson,
        message: "Đã thêm bài học thành công",
      })
    );
  } catch (error) {
    console.error("Error adding lesson:", error);
    res.status(500).json(responseError("Lỗi khi thêm bài học"));
  }
};

// Helper function to update course statistics
const updateCourseStats = async (courseId) => {
  try {
    const totalLessons = await Lesson.countDocuments({ courseId });
    const totalDuration = await Lesson.aggregate([
      { $match: { courseId } },
      { $group: { _id: null, total: { $sum: "$videoDuration" } } },
    ]);

    await Course.findByIdAndUpdate(courseId, {
      totalLessons,
      totalDuration: totalDuration[0]?.total || 0,
    });
  } catch (error) {
    console.error("Error updating course stats:", error);
  }
};

module.exports = {
  getCourses,
  getCourseDetail,
  createCourse,
  updateCourse,
  deleteCourse,
  addModule,
  addLesson,
};
