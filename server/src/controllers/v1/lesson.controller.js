const Lesson = require("../../models/lesson.model");
const Course = require("../../models/course.model");
const UserProgress = require("../../models/user_progress.model");
const User = require("../../models/user.model");
const { responseSuccess, responseError } = require("../../utils/response");

// GET /lessons/:id - Get lesson (check access)
const getLesson = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const lesson = await Lesson.findById(id)
      .populate("moduleId", "title order")
      .populate("courseId", "title slug")
      .lean();

    if (!lesson) {
      return res.status(404).json(responseError("Không tìm thấy bài học"));
    }

    // Check if user has access to this lesson
    const user = await User.findById(userId);
    const hasAccess = lesson.isFree || user.hasPurchasedCourse(lesson.courseId._id);

    if (!hasAccess) {
      return res.status(403).json(responseError("Bạn cần mua khóa học để xem bài học này"));
    }

    // Get user progress for this course
    const progress = await UserProgress.findOne({
      userId,
      courseId: lesson.courseId._id,
    });

    const lessonWithAccess = {
      ...lesson,
      isCompleted: progress?.isLessonCompleted(lesson._id) || false,
      formattedDuration: `${Math.floor(lesson.videoDuration / 60)}:${(
        lesson.videoDuration % 60
      )
        .toString()
        .padStart(2, "0")}`,
      course: {
        title: lesson.courseId.title,
        slug: lesson.courseId.slug,
      },
      module: {
        title: lesson.moduleId.title,
        order: lesson.moduleId.order,
      },
    };

    res.json(responseSuccess(lessonWithAccess));
  } catch (error) {
    console.error("Error getting lesson:", error);
    res.status(500).json(responseError("Lỗi khi lấy bài học"));
  }
};

// POST /lessons/:id/complete - Mark lesson as complete
const markLessonComplete = async (req, res) => {
  try {
    const { id } = req.params;
    const { watchDuration = 0 } = req.body;
    const userId = req.user.id;

    const lesson = await Lesson.findById(id).populate("courseId");
    if (!lesson) {
      return res.status(404).json(responseError("Không tìm thấy bài học"));
    }

    // Check if user has access to this lesson
    const user = await User.findById(userId);
    const hasAccess = lesson.isFree || user.hasPurchasedCourse(lesson.courseId._id);

    if (!hasAccess) {
      return res.status(403).json(responseError("Bạn cần mua khóa học để xem bài học này"));
    }

    // Get or create user progress
    let progress = await UserProgress.findOne({
      userId,
      courseId: lesson.courseId._id,
    });

    if (!progress) {
      progress = new UserProgress({
        userId,
        courseId: lesson.courseId._id,
        purchasedAt: new Date(), // This should be the actual purchase date
        completedLessons: [],
        progress: 0,
        totalWatchTime: 0,
      });
    }

    // Mark lesson as completed
    await progress.markLessonCompleted(lesson._id, watchDuration);

    // Update total watch time
    progress.totalWatchTime += Math.floor(watchDuration / 60); // Convert to minutes

    // Calculate overall progress
    const totalLessons = await Lesson.countDocuments({ courseId: lesson.courseId._id });
    progress.progress = progress.calculateProgress(totalLessons);

    await progress.save();

    res.json(
      responseSuccess({
        message: "Đã đánh dấu hoàn thành bài học",
        progress: progress.progress,
        completedLessons: progress.completedLessons.length,
        totalLessons,
      })
    );
  } catch (error) {
    console.error("Error marking lesson complete:", error);
    res.status(500).json(responseError("Lỗi khi đánh dấu hoàn thành bài học"));
  }
};

// GET /lessons/course/:courseId - Get all lessons for a course
const getCourseLessons = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    // Check if user has access to this course
    const user = await User.findById(userId);
    const course = await Course.findById(courseId);
    
    if (!course) {
      return res.status(404).json(responseError("Không tìm thấy khóa học"));
    }

    const hasAccess = user.hasPurchasedCourse(courseId);

    // Get lessons with modules
    const lessons = await Lesson.find({ courseId })
      .populate("moduleId", "title order")
      .sort({ "moduleId.order": 1, order: 1 })
      .lean();

    // Get user progress
    const progress = await UserProgress.findOne({
      userId,
      courseId,
    });

    const lessonsWithAccess = lessons.map((lesson) => ({
      ...lesson,
      isAccessible: lesson.isFree || hasAccess,
      isCompleted: progress?.isLessonCompleted(lesson._id) || false,
      formattedDuration: `${Math.floor(lesson.videoDuration / 60)}:${(
        lesson.videoDuration % 60
      )
        .toString()
        .padStart(2, "0")}`,
    }));

    // Group lessons by module
    const lessonsByModule = {};
    lessonsWithAccess.forEach((lesson) => {
      const moduleId = lesson.moduleId._id.toString();
      if (!lessonsByModule[moduleId]) {
        lessonsByModule[moduleId] = {
          module: lesson.moduleId,
          lessons: [],
        };
      }
      lessonsByModule[moduleId].lessons.push(lesson);
    });

    res.json(
      responseSuccess({
        course: {
          title: course.title,
          slug: course.slug,
        },
        modules: Object.values(lessonsByModule),
        userProgress: progress || {
          progress: 0,
          completedLessons: [],
          lastWatchedLesson: null,
        },
      })
    );
  } catch (error) {
    console.error("Error getting course lessons:", error);
    res.status(500).json(responseError("Lỗi khi lấy danh sách bài học"));
  }
};

module.exports = {
  getLesson,
  markLessonComplete,
  getCourseLessons,
};
