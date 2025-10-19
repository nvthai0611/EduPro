const Course = require("../../models/course.model");
const Bundle = require("../../models/bundle.model");
const Order = require("../../models/order.model");
const Coupon = require("../../models/coupon.model");
const User = require("../../models/user.model");
const UserProgress = require("../../models/user_progress.model");
const { responseSuccess, responseError } = require("../../utils/response");

// POST /purchase/course/:id - Purchase course
const purchaseCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { couponCode } = req.body;
    const userId = req.user.id;

    // Check if course exists
    const course = await Course.findById(id);
    if (!course || !course.isPublished) {
      return res.status(404).json(responseError("Không tìm thấy khóa học"));
    }

    // Check if user already purchased this course
    const user = await User.findById(userId);
    if (user.hasPurchasedCourse(id)) {
      return res.status(400).json(responseError("Bạn đã mua khóa học này rồi"));
    }

    // Calculate price
    let finalPrice = course.salePrice || course.price;
    let coupon = null;
    let discount = 0;

    // Apply coupon if provided
    if (couponCode) {
      coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
      if (!coupon || !coupon.isValid()) {
        return res.status(400).json(responseError("Mã giảm giá không hợp lệ"));
      }

      if (!coupon.appliesToCourse(id)) {
        return res.status(400).json(responseError("Mã giảm giá không áp dụng cho khóa học này"));
      }

      discount = coupon.calculateDiscount(finalPrice);
      finalPrice = Math.max(0, finalPrice - discount);
    }

    // Create order
    const order = new Order({
      userId,
      items: [
        {
          type: "course",
          itemId: course._id,
          title: course.title,
          price: course.salePrice || course.price,
          discountedPrice: finalPrice,
        },
      ],
      subtotal: course.salePrice || course.price,
      discount,
      total: finalPrice,
      couponUsed: coupon?._id,
      paymentMethod: "payos", // Default to PayOS
    });

    await order.save();

    res.json(
      responseSuccess({
        orderId: order._id,
        course: {
          title: course.title,
          thumbnail: course.thumbnail,
        },
        pricing: {
          originalPrice: course.salePrice || course.price,
          discount,
          finalPrice,
        },
        coupon: coupon ? {
          code: coupon.code,
          discountType: coupon.discountType,
          discountValue: coupon.discountValue,
        } : null,
      })
    );
  } catch (error) {
    console.error("Error purchasing course:", error);
    res.status(500).json(responseError("Lỗi khi mua khóa học"));
  }
};

// POST /purchase/bundle/:id - Purchase bundle
const purchaseBundle = async (req, res) => {
  try {
    const { id } = req.params;
    const { couponCode } = req.body;
    const userId = req.user.id;

    // Check if bundle exists
    const bundle = await Bundle.findById(id).populate("courses");
    if (!bundle || !bundle.isActive) {
      return res.status(404).json(responseError("Không tìm thấy combo"));
    }

    // Check if user already purchased this bundle
    const user = await User.findById(userId);
    if (user.hasPurchasedBundle(id)) {
      return res.status(400).json(responseError("Bạn đã mua combo này rồi"));
    }

    // Check if user already owns any course in bundle
    const ownedCourses = user.getPurchasedCourseIds();
    const newCourses = bundle.courses.filter(
      (course) => !ownedCourses.includes(course._id.toString())
    );

    if (newCourses.length === 0) {
      return res.status(400).json(responseError("Bạn đã sở hữu tất cả khóa học trong combo này"));
    }

    // Calculate price (only for courses user doesn't own)
    let finalPrice = bundle.bundlePrice;
    let coupon = null;
    let discount = 0;

    // Apply coupon if provided
    if (couponCode) {
      coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
      if (!coupon || !coupon.isValid()) {
        return res.status(400).json(responseError("Mã giảm giá không hợp lệ"));
      }

      if (!coupon.appliesToBundle(id)) {
        return res.status(400).json(responseError("Mã giảm giá không áp dụng cho combo này"));
      }

      discount = coupon.calculateDiscount(finalPrice);
      finalPrice = Math.max(0, finalPrice - discount);
    }

    // Create order
    const order = new Order({
      userId,
      items: [
        {
          type: "bundle",
          itemId: bundle._id,
          title: bundle.title,
          price: bundle.bundlePrice,
          discountedPrice: finalPrice,
        },
      ],
      subtotal: bundle.bundlePrice,
      discount,
      total: finalPrice,
      couponUsed: coupon?._id,
      paymentMethod: "payos",
    });

    await order.save();

    res.json(
      responseSuccess({
        orderId: order._id,
        bundle: {
          title: bundle.title,
          thumbnail: bundle.thumbnail,
          coursesCount: bundle.courses.length,
        },
        pricing: {
          originalPrice: bundle.bundlePrice,
          discount,
          finalPrice,
        },
        coupon: coupon ? {
          code: coupon.code,
          discountType: coupon.discountType,
          discountValue: coupon.discountValue,
        } : null,
      })
    );
  } catch (error) {
    console.error("Error purchasing bundle:", error);
    res.status(500).json(responseError("Lỗi khi mua combo"));
  }
};

// GET /my-courses - Get user's purchased courses
const getMyCourses = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status = "all" } = req.query;

    const user = await User.findById(userId)
      .populate({
        path: "purchasedCourses.courseId",
        populate: {
          path: "category",
          select: "name",
        },
      })
      .lean();

    let courses = user.purchasedCourses.map((purchase) => ({
      ...purchase.courseId,
      purchasedAt: purchase.purchasedAt,
      purchasePrice: purchase.price,
    }));

    // Filter by status if needed
    if (status !== "all") {
      // This would require checking UserProgress for completion status
      // For now, return all purchased courses
    }

    // Get progress for each course
    const courseIds = courses.map((course) => course._id);
    const progressData = await UserProgress.find({
      userId,
      courseId: { $in: courseIds },
    }).lean();

    const progressMap = {};
    progressData.forEach((progress) => {
      progressMap[progress.courseId.toString()] = progress;
    });

    courses = courses.map((course) => ({
      ...course,
      progress: progressMap[course._id.toString()] || {
        progress: 0,
        completedLessons: [],
        lastWatchedLesson: null,
      },
      url: `/courses/${course.slug}`,
    }));

    res.json(responseSuccess({ courses }));
  } catch (error) {
    console.error("Error getting my courses:", error);
    res.status(500).json(responseError("Lỗi khi lấy khóa học của tôi"));
  }
};

// GET /my-bundles - Get user's purchased bundles
const getMyBundles = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId)
      .populate({
        path: "purchasedBundles.bundleId",
        populate: {
          path: "courses",
          select: "title slug thumbnail",
        },
      })
      .lean();

    const bundles = user.purchasedBundles.map((purchase) => ({
      ...purchase.bundleId,
      purchasedAt: purchase.purchasedAt,
      purchasePrice: purchase.price,
      url: `/bundles/${purchase.bundleId.slug}`,
    }));

    res.json(responseSuccess({ bundles }));
  } catch (error) {
    console.error("Error getting my bundles:", error);
    res.status(500).json(responseError("Lỗi khi lấy combo của tôi"));
  }
};

module.exports = {
  purchaseCourse,
  purchaseBundle,
  getMyCourses,
  getMyBundles,
};
