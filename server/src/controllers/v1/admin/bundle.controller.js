const Bundle = require("../../models/bundle.model");
const Course = require("../../models/course.model");
const { responseSuccess, responseError } = require("../../utils/response");

// GET /admin/bundles - Get all bundles (admin)
const getBundles = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
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

    if (status !== undefined) {
      filter.isActive = status === "active";
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

    const bundles = await Bundle.find(filter)
      .populate("courses", "title slug thumbnail price")
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Bundle.countDocuments(filter);

    // Add computed fields
    const bundlesWithComputed = bundles.map((bundle) => ({
      ...bundle,
      savings: bundle.originalPrice - bundle.bundlePrice,
      coursesCount: bundle.courses.length,
    }));

    res.json(
      responseSuccess({
        bundles: bundlesWithComputed,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit)),
        },
      })
    );
  } catch (error) {
    console.error("Error getting bundles:", error);
    res.status(500).json(responseError("Lỗi khi lấy danh sách combo"));
  }
};

// GET /admin/bundles/:id - Get bundle detail (admin)
const getBundleDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const bundle = await Bundle.findById(id)
      .populate("courses", "title slug thumbnail price salePrice")
      .lean();

    if (!bundle) {
      return res.status(404).json(responseError("Không tìm thấy combo"));
    }

    const bundleWithComputed = {
      ...bundle,
      savings: bundle.originalPrice - bundle.bundlePrice,
      coursesCount: bundle.courses.length,
    };

    res.json(responseSuccess(bundleWithComputed));
  } catch (error) {
    console.error("Error getting bundle detail:", error);
    res.status(500).json(responseError("Lỗi khi lấy chi tiết combo"));
  }
};

// POST /admin/bundles - Create bundle
const createBundle = async (req, res) => {
  try {
    const {
      title,
      slug,
      description,
      thumbnail,
      courses,
      originalPrice,
      bundlePrice,
      discount,
      isActive,
    } = req.body;

    // Check if slug already exists
    const existingBundle = await Bundle.findOne({ slug });
    if (existingBundle) {
      return res.status(400).json(responseError("Slug đã tồn tại"));
    }

    // Verify all courses exist
    const coursesExist = await Course.find({ _id: { $in: courses } });
    if (coursesExist.length !== courses.length) {
      return res.status(400).json(responseError("Một số khóa học không tồn tại"));
    }

    // Calculate original price if not provided
    const calculatedOriginalPrice = originalPrice || coursesExist.reduce(
      (sum, course) => sum + (course.salePrice || course.price),
      0
    );

    const bundle = new Bundle({
      title,
      slug,
      description,
      thumbnail,
      courses,
      originalPrice: calculatedOriginalPrice,
      bundlePrice,
      discount,
      isActive: isActive !== undefined ? isActive : true,
    });

    await bundle.save();

    // Populate courses for response
    await bundle.populate("courses", "title slug thumbnail price");

    res.json(
      responseSuccess({
        bundle,
        message: "Đã tạo combo thành công",
      })
    );
  } catch (error) {
    console.error("Error creating bundle:", error);
    res.status(500).json(responseError("Lỗi khi tạo combo"));
  }
};

// PUT /admin/bundles/:id - Update bundle
const updateBundle = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check if slug already exists (if being updated)
    if (updateData.slug) {
      const existingBundle = await Bundle.findOne({
        slug: updateData.slug,
        _id: { $ne: id },
      });
      if (existingBundle) {
        return res.status(400).json(responseError("Slug đã tồn tại"));
      }
    }

    // Verify courses exist (if being updated)
    if (updateData.courses) {
      const coursesExist = await Course.find({ _id: { $in: updateData.courses } });
      if (coursesExist.length !== updateData.courses.length) {
        return res.status(400).json(responseError("Một số khóa học không tồn tại"));
      }

      // Recalculate original price if courses changed
      if (!updateData.originalPrice) {
        updateData.originalPrice = coursesExist.reduce(
          (sum, course) => sum + (course.salePrice || course.price),
          0
        );
      }
    }

    const bundle = await Bundle.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate("courses", "title slug thumbnail price");

    if (!bundle) {
      return res.status(404).json(responseError("Không tìm thấy combo"));
    }

    res.json(
      responseSuccess({
        bundle,
        message: "Đã cập nhật combo thành công",
      })
    );
  } catch (error) {
    console.error("Error updating bundle:", error);
    res.status(500).json(responseError("Lỗi khi cập nhật combo"));
  }
};

// DELETE /admin/bundles/:id - Delete bundle
const deleteBundle = async (req, res) => {
  try {
    const { id } = req.params;

    const bundle = await Bundle.findById(id);
    if (!bundle) {
      return res.status(404).json(responseError("Không tìm thấy combo"));
    }

    await Bundle.findByIdAndDelete(id);

    res.json(responseSuccess({ message: "Đã xóa combo thành công" }));
  } catch (error) {
    console.error("Error deleting bundle:", error);
    res.status(500).json(responseError("Lỗi khi xóa combo"));
  }
};

// POST /admin/bundles/:id/courses - Add course to bundle
const addCourseToBundle = async (req, res) => {
  try {
    const { id } = req.params;
    const { courseId } = req.body;

    const bundle = await Bundle.findById(id);
    if (!bundle) {
      return res.status(404).json(responseError("Không tìm thấy combo"));
    }

    // Check if course already in bundle
    if (bundle.courses.includes(courseId)) {
      return res.status(400).json(responseError("Khóa học đã có trong combo"));
    }

    // Verify course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json(responseError("Không tìm thấy khóa học"));
    }

    // Add course to bundle
    bundle.courses.push(courseId);
    bundle.originalPrice += course.salePrice || course.price;
    await bundle.save();

    await bundle.populate("courses", "title slug thumbnail price");

    res.json(
      responseSuccess({
        bundle,
        message: "Đã thêm khóa học vào combo",
      })
    );
  } catch (error) {
    console.error("Error adding course to bundle:", error);
    res.status(500).json(responseError("Lỗi khi thêm khóa học vào combo"));
  }
};

// DELETE /admin/bundles/:id/courses/:courseId - Remove course from bundle
const removeCourseFromBundle = async (req, res) => {
  try {
    const { id, courseId } = req.params;

    const bundle = await Bundle.findById(id);
    if (!bundle) {
      return res.status(404).json(responseError("Không tìm thấy combo"));
    }

    // Remove course from bundle
    bundle.courses = bundle.courses.filter(
      (id) => id.toString() !== courseId
    );

    // Recalculate original price
    const courses = await Course.find({ _id: { $in: bundle.courses } });
    bundle.originalPrice = courses.reduce(
      (sum, course) => sum + (course.salePrice || course.price),
      0
    );

    await bundle.save();

    await bundle.populate("courses", "title slug thumbnail price");

    res.json(
      responseSuccess({
        bundle,
        message: "Đã xóa khóa học khỏi combo",
      })
    );
  } catch (error) {
    console.error("Error removing course from bundle:", error);
    res.status(500).json(responseError("Lỗi khi xóa khóa học khỏi combo"));
  }
};

module.exports = {
  getBundles,
  getBundleDetail,
  createBundle,
  updateBundle,
  deleteBundle,
  addCourseToBundle,
  removeCourseFromBundle,
};
