const Bundle = require("../../models/bundle.model");
const Course = require("../../models/course.model");
const { responseSuccess, responseError } = require("../../utils/response");

// GET /bundles - Browse bundles
const getBundles = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      search,
      sort = "newest",
    } = req.query;

    // Build filter object
    const filter = { isActive: true };

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
      case "discount":
        sortOptions = { discount: -1 };
        break;
      case "price_low":
        sortOptions = { bundlePrice: 1 };
        break;
      case "price_high":
        sortOptions = { bundlePrice: -1 };
        break;
      default:
        sortOptions = { createdAt: -1 };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const bundles = await Bundle.find(filter)
      .populate("courses", "title thumbnail price")
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Bundle.countDocuments(filter);

    // Add computed fields
    const bundlesWithComputed = bundles.map((bundle) => ({
      ...bundle,
      savings: bundle.originalPrice - bundle.bundlePrice,
      url: `/bundles/${bundle.slug}`,
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

// GET /bundles/:slug - Bundle detail
const getBundleDetail = async (req, res) => {
  try {
    const { slug } = req.params;

    const bundle = await Bundle.findOne({ slug, isActive: true })
      .populate("courses", "title slug thumbnail price salePrice description totalLessons totalDuration")
      .lean();

    if (!bundle) {
      return res.status(404).json(responseError("Không tìm thấy combo"));
    }

    // Get related bundles
    const relatedBundles = await Bundle.find({
      _id: { $ne: bundle._id },
      isActive: true,
    })
      .select("title slug thumbnail originalPrice bundlePrice discount")
      .limit(4)
      .lean();

    const bundleWithComputed = {
      ...bundle,
      savings: bundle.originalPrice - bundle.bundlePrice,
      url: `/bundles/${bundle.slug}`,
      coursesCount: bundle.courses.length,
      courses: bundle.courses.map((course) => ({
        ...course,
        currentPrice: course.salePrice || course.price,
        url: `/courses/${course.slug}`,
      })),
      relatedBundles: relatedBundles.map((related) => ({
        ...related,
        savings: related.originalPrice - related.bundlePrice,
        url: `/bundles/${related.slug}`,
      })),
    };

    res.json(responseSuccess(bundleWithComputed));
  } catch (error) {
    console.error("Error getting bundle detail:", error);
    res.status(500).json(responseError("Lỗi khi lấy chi tiết combo"));
  }
};

module.exports = {
  getBundles,
  getBundleDetail,
};
