const UserProgress = require("../../models/user_progress.model");
const Course = require("../../models/course.model");
const Lesson = require("../../models/lesson.model");
const { responseSuccess, responseError } = require("../../utils/response");

// GET /progress/:courseId - Get user progress for a course
const getCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    // Verify course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json(responseError("Không tìm thấy khóa học"));
    }

    // Get user progress
    const progress = await UserProgress.findOne({
      userId,
      courseId,
    })
      .populate("lastWatchedLesson", "title order")
      .populate("completedLessons.lessonId", "title order")
      .lean();

    if (!progress) {
      return res.json(
        responseSuccess({
          course: {
            title: course.title,
            slug: course.slug,
          },
          progress: 0,
          completedLessons: [],
          lastWatchedLesson: null,
          totalWatchTime: 0,
          purchasedAt: null,
        })
      );
    }

    // Get total lessons count
    const totalLessons = await Lesson.countDocuments({ courseId });

    res.json(
      responseSuccess({
        course: {
          title: course.title,
          slug: course.slug,
        },
        progress: progress.progress,
        completedLessons: progress.completedLessons,
        lastWatchedLesson: progress.lastWatchedLesson,
        totalWatchTime: progress.totalWatchTime,
        purchasedAt: progress.purchasedAt,
        totalLessons,
        completionRate: Math.round((progress.completedLessons.length / totalLessons) * 100),
      })
    );
  } catch (error) {
    console.error("Error getting course progress:", error);
    res.status(500).json(responseError("Lỗi khi lấy tiến độ học tập"));
  }
};

// PUT /progress/:courseId/update - Update user progress
const updateCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { lessonId, watchDuration = 0 } = req.body;
    const userId = req.user.id;

    // Verify course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json(responseError("Không tìm thấy khóa học"));
    }

    // Get or create user progress
    let progress = await UserProgress.findOne({
      userId,
      courseId,
    });

    if (!progress) {
      progress = new UserProgress({
        userId,
        courseId,
        purchasedAt: new Date(),
        completedLessons: [],
        progress: 0,
        totalWatchTime: 0,
      });
    }

    // Update progress if lessonId provided
    if (lessonId) {
      await progress.markLessonCompleted(lessonId, watchDuration);
      
      // Update total watch time
      progress.totalWatchTime += Math.floor(watchDuration / 60);
    }

    // Calculate overall progress
    const totalLessons = await Lesson.countDocuments({ courseId });
    progress.progress = progress.calculateProgress(totalLessons);

    await progress.save();

    res.json(
      responseSuccess({
        message: "Đã cập nhật tiến độ học tập",
        progress: progress.progress,
        completedLessons: progress.completedLessons.length,
        totalLessons,
        totalWatchTime: progress.totalWatchTime,
      })
    );
  } catch (error) {
    console.error("Error updating course progress:", error);
    res.status(500).json(responseError("Lỗi khi cập nhật tiến độ học tập"));
  }
};

// GET /progress/all - Get all user progress
const getAllProgress = async (req, res) => {
  try {
    const userId = req.user.id;

    const progressData = await UserProgress.find({ userId })
      .populate("courseId", "title slug thumbnail totalLessons")
      .populate("lastWatchedLesson", "title order")
      .lean();

    // Calculate completion rates
    const progressWithRates = await Promise.all(
      progressData.map(async (progress) => {
        const totalLessons = await Lesson.countDocuments({
          courseId: progress.courseId._id,
        });
        
        return {
          ...progress,
          completionRate: Math.round((progress.completedLessons.length / totalLessons) * 100),
          totalLessons,
        };
      })
    );

    res.json(responseSuccess({ progress: progressWithRates }));
  } catch (error) {
    console.error("Error getting all progress:", error);
    res.status(500).json(responseError("Lỗi khi lấy tiến độ học tập"));
  }
};

// GET /progress/stats - Get learning statistics
const getLearningStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const stats = await UserProgress.aggregate([
      { $match: { userId: userId } },
      {
        $group: {
          _id: null,
          totalCourses: { $sum: 1 },
          totalWatchTime: { $sum: "$totalWatchTime" },
          averageProgress: { $avg: "$progress" },
          totalCompletedLessons: { $sum: { $size: "$completedLessons" } },
        },
      },
    ]);

    const result = stats[0] || {
      totalCourses: 0,
      totalWatchTime: 0,
      averageProgress: 0,
      totalCompletedLessons: 0,
    };

    res.json(
      responseSuccess({
        totalCourses: result.totalCourses,
        totalWatchTime: result.totalWatchTime,
        averageProgress: Math.round(result.averageProgress),
        totalCompletedLessons: result.totalCompletedLessons,
        totalWatchTimeFormatted: `${Math.floor(result.totalWatchTime / 60)} giờ ${result.totalWatchTime % 60} phút`,
      })
    );
  } catch (error) {
    console.error("Error getting learning stats:", error);
    res.status(500).json(responseError("Lỗi khi lấy thống kê học tập"));
  }
};

module.exports = {
  getCourseProgress,
  updateCourseProgress,
  getAllProgress,
  getLearningStats,
};