const Course = require("../../models/course.model");
const Bundle = require("../../models/bundle.model");
const LearningPath = require("../../models/learning_path.model");
const User = require("../../models/user.model");
const Order = require("../../models/order.model");
const UserProgress = require("../../models/user_progress.model");
const { responseSuccess, responseError } = require("../../utils/response");

// GET /admin/dashboard - Get dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    // Get basic counts
    const [
      totalCourses,
      totalBundles,
      totalLearningPaths,
      totalUsers,
      totalOrders,
    ] = await Promise.all([
      Course.countDocuments(),
      Bundle.countDocuments(),
      LearningPath.countDocuments(),
      User.countDocuments(),
      Order.countDocuments(),
    ]);

    // Get revenue statistics
    const revenueStats = await Order.aggregate([
      { $match: { statusOrder: "completed", paymentStatus: "paid" } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$total" },
          totalOrders: { $sum: 1 },
          averageOrderValue: { $avg: "$total" },
        },
      },
    ]);

    // Get monthly revenue (last 12 months)
    const monthlyRevenue = await Order.aggregate([
      {
        $match: {
          statusOrder: "completed",
          paymentStatus: "paid",
          createdAt: {
            $gte: new Date(new Date().setMonth(new Date().getMonth() - 12)),
          },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          revenue: { $sum: "$total" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    // Get popular courses
    const popularCourses = await Course.find({ isPublished: true })
      .select("title slug thumbnail totalStudents rating price")
      .sort({ totalStudents: -1 })
      .limit(5)
      .lean();

    // Get recent enrollments
    const recentEnrollments = await Order.find({
      statusOrder: "completed",
      paymentStatus: "paid",
    })
      .populate("userId", "fullName email")
      .populate("items.itemId", "title")
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    // Get course completion rates
    const courseCompletionStats = await UserProgress.aggregate([
      {
        $group: {
          _id: "$courseId",
          totalStudents: { $sum: 1 },
          averageProgress: { $avg: "$progress" },
          completedStudents: {
            $sum: {
              $cond: [{ $eq: ["$progress", 100] }, 1, 0],
            },
          },
        },
      },
      {
        $lookup: {
          from: "courses",
          localField: "_id",
          foreignField: "_id",
          as: "course",
        },
      },
      { $unwind: "$course" },
      {
        $project: {
          courseTitle: "$course.title",
          totalStudents: 1,
          averageProgress: { $round: ["$averageProgress", 2] },
          completionRate: {
            $round: [
              { $multiply: [{ $divide: ["$completedStudents", "$totalStudents"] }, 100] },
              2,
            ],
          },
        },
      },
      { $sort: { totalStudents: -1 } },
      { $limit: 5 },
    ]);

    const stats = {
      overview: {
        totalCourses,
        totalBundles,
        totalLearningPaths,
        totalUsers,
        totalOrders,
        totalRevenue: revenueStats[0]?.totalRevenue || 0,
        totalPaidOrders: revenueStats[0]?.totalOrders || 0,
        averageOrderValue: revenueStats[0]?.averageOrderValue || 0,
      },
      monthlyRevenue,
      popularCourses,
      recentEnrollments,
      courseCompletionStats,
    };

    res.json(responseSuccess(stats));
  } catch (error) {
    console.error("Error getting dashboard stats:", error);
    res.status(500).json(responseError("Lỗi khi lấy thống kê dashboard"));
  }
};

// GET /admin/dashboard/revenue - Get detailed revenue statistics
const getRevenueStats = async (req, res) => {
  try {
    const { period = "month", startDate, endDate } = req.query;

    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter = {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      };
    } else {
      // Default to last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      dateFilter = { createdAt: { $gte: thirtyDaysAgo } };
    }

    // Revenue by payment method
    const revenueByMethod = await Order.aggregate([
      {
        $match: {
          ...dateFilter,
          statusOrder: "completed",
          paymentStatus: "paid",
        },
      },
      {
        $group: {
          _id: "$paymentMethod",
          totalRevenue: { $sum: "$total" },
          totalOrders: { $sum: 1 },
        },
      },
    ]);

    // Revenue by course/bundle
    const revenueByItem = await Order.aggregate([
      {
        $match: {
          ...dateFilter,
          statusOrder: "completed",
          paymentStatus: "paid",
        },
      },
      { $unwind: "$items" },
      {
        $group: {
          _id: {
            type: "$items.type",
            itemId: "$items.itemId",
            title: "$items.title",
          },
          totalRevenue: { $sum: "$items.discountedPrice" },
          totalSales: { $sum: 1 },
        },
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: 10 },
    ]);

    // Daily revenue trend
    const dailyRevenue = await Order.aggregate([
      {
        $match: {
          ...dateFilter,
          statusOrder: "completed",
          paymentStatus: "paid",
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          },
          revenue: { $sum: "$total" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
    ]);

    res.json(
      responseSuccess({
        revenueByMethod,
        revenueByItem,
        dailyRevenue,
        period,
        dateRange: { startDate, endDate },
      })
    );
  } catch (error) {
    console.error("Error getting revenue stats:", error);
    res.status(500).json(responseError("Lỗi khi lấy thống kê doanh thu"));
  }
};

// GET /admin/dashboard/users - Get user statistics
const getUserStats = async (req, res) => {
  try {
    // User registration trend (last 12 months)
    const userRegistrationTrend = await User.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(new Date().setMonth(new Date().getMonth() - 12)),
          },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    // User activity (users with progress)
    const activeUsers = await UserProgress.distinct("userId");
    const totalActiveUsers = activeUsers.length;

    // Top learners (users with most completed courses)
    const topLearners = await UserProgress.aggregate([
      {
        $group: {
          _id: "$userId",
          completedCourses: {
            $sum: { $cond: [{ $eq: ["$progress", 100] }, 1, 0] },
          },
          totalProgress: { $sum: "$progress" },
          totalWatchTime: { $sum: "$totalWatchTime" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          userName: "$user.fullName",
          userEmail: "$user.email",
          completedCourses: 1,
          totalProgress: 1,
          totalWatchTime: 1,
        },
      },
      { $sort: { completedCourses: -1 } },
      { $limit: 10 },
    ]);

    res.json(
      responseSuccess({
        totalUsers: await User.countDocuments(),
        totalActiveUsers,
        userRegistrationTrend,
        topLearners,
      })
    );
  } catch (error) {
    console.error("Error getting user stats:", error);
    res.status(500).json(responseError("Lỗi khi lấy thống kê người dùng"));
  }
};

module.exports = {
  getDashboardStats,
  getRevenueStats,
  getUserStats,
};