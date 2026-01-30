import { Router, Request, Response } from "express";
import { Server } from "socket.io";
const router: Router = Router();
import { authRoutes } from "./v1/auth/auth.routes";
import { categoryRoutes } from "./v1/categories.routes";
import { roleAdminRoutes } from "./v1/admin/roles.routes";
import { userAdminRoutes } from "./v1/admin/users.routes";
import { courseRoutes } from "./v1/course/course.routes";
import { orderRoutes } from "./v1/order.route";
import { paymentRoutes } from "./v1/payment.routes";
import { courseAdminRoutes } from "./v1/admin/course.routes";
import { userRoutes } from "./v1/users.routes";
import { sectionRoutes } from "./v1/admin/section.routes";
import { publicSectionRoutes } from "./v1/section.routes";
import { lessonRoutes } from "./v1/admin/lesson.routes";
import { lessonRoutes as publicLessonRoutes } from "./v1/lesson.routes";
import { articleRoutes } from "./v1/article.routes";
import { articleAdminRoutes } from "./v1/admin/article.routes";
import { orderAdminRoutes } from "./v1/admin/order.route";
import { submissionRoutes } from "./v1/submission.routes";
import blockDirectAccess from "../middlewares/auth/blockDirectAccess";
import { attendanceRoutes } from "./v1/admin/attendance.route";
// import { bannerAdminRoutes } from "./v1/admin/banner.route";
// import { bannerRoutes } from "./v1/banner.route";
import { settingAdminRoutes } from "./v1/admin/setting.routes";
import { settingRoutes } from "./v1/setting.routes";
import optionalAuth from "../middlewares/auth/optionalAuth";
import optionalAuthenticate from "../middlewares/auth/optionalAuthenticate";
import { reviewRoutes } from "./v1/reviews.routes";
import { adminForumRoutes } from "./v1/admin/forum.routes";
import { forumRoutes } from "./v1/forum.routes";
import { postRoutes } from "./v1/posts.routes";
import { answerRoutes } from "./v1/answers.routes";
import { commentRoutes } from "./v1/comments.routes";
import { progressRoutes } from "./v1/progress.routes";
import { notificationRoutes } from "./v1/notification.routes";


export const apiRouter = (io?: Server) => {
  // Block direct browser access to API
  // router.use(blockDirectAccess);

  // Authentication routes
  router.use("/auth", authRoutes);

  // Category routes
  router.use("/category", optionalAuth, categoryRoutes);

  // Course routes (public with optional auth + rate limiting)
  router.use("/courses", optionalAuth, courseRoutes);

  // Public sections routes (for learners)
  router.use("/sections", optionalAuth, publicSectionRoutes);

  // Public lesson routes (for learners to view lesson content)
  router.use("/lessons", optionalAuth, publicLessonRoutes);

  // Order routes
  router.use("/orders", optionalAuth, orderRoutes);

  // User routes
  router.use("/users", optionalAuth, userRoutes);

  // Review routes
  router.use("/reviews", optionalAuth, reviewRoutes);

  // Payment routes
  router.use("/payment", optionalAuth, paymentRoutes(io));

  // Role routes
  router.use("/admin/role", optionalAuth, roleAdminRoutes);

  // User routes
  router.use("/admin/user", optionalAuth, userAdminRoutes);

  // Course routes
  router.use("/admin/course", optionalAuth, courseAdminRoutes);

  // Section routes
  router.use("/admin/sections", optionalAuth, sectionRoutes);

  // Lesson routes
  router.use("/admin/lessons", optionalAuth, lessonRoutes);
  router.use("/admin/articles", optionalAuth, articleAdminRoutes);

  // Article content routes for learners
  router.use("/articles", optionalAuth, articleRoutes);

  // Lesson content routes for learners
  router.use("/lessons", optionalAuth, publicLessonRoutes);

  // Lesson comment and submission routes
  router.use("/lesson-comments", optionalAuth, submissionRoutes);

  // Course routes
  router.use("/admin/order", optionalAuth, orderAdminRoutes);

  // Course routes
  router.use("/admin/attendance", optionalAuth, attendanceRoutes);

  // Admin Banner routes
  // router.use("/admin/banner", optionalAuth, bannerAdminRoutes);

  //public Banner routes
  // router.use("/banner", optionalAuth, bannerRoutes);
  // setting routes
  router.use("/admin/setting", optionalAuth, settingAdminRoutes);
  router.use("/setting", optionalAuth, settingRoutes);

  router.use("/admin/forum", adminForumRoutes);
  router.use("/forum", forumRoutes);
  router.use("/posts", postRoutes);
  router.use("/answers", optionalAuth, answerRoutes);
  router.use("/comments", optionalAuth, commentRoutes);

  router.use("/progress", progressRoutes);

  router.use("/notifications", optionalAuthenticate, notificationRoutes);
  return router;
};
