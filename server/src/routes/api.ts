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
import requireAuth from "../middlewares/auth/requireActiveAuth";
import { reviewRoutes } from "./v1/reviews.routes";

export const apiRouter = (io?: Server) => {
  // Block direct browser access to API
  // router.use(blockDirectAccess);

  // Authentication routes
  router.use("/auth", authRoutes);

  // Category routes
  router.use("/category", requireAuth, categoryRoutes);

  // Course routes (public with optional auth + rate limiting)
  router.use("/courses", requireAuth, courseRoutes);

  // Public sections routes (for learners)
  router.use("/sections", requireAuth, publicSectionRoutes);

  // Public lesson routes (for learners to view lesson content)
  router.use("/lessons", requireAuth, publicLessonRoutes);

  // Order routes
  router.use("/orders", requireAuth, orderRoutes);

  // User routes
  router.use("/users", requireAuth, userRoutes);

  // Review routes
  router.use("/reviews", requireAuth, reviewRoutes);

  // Payment routes
  router.use("/payment", requireAuth, paymentRoutes(io));

  // Role routes
  router.use("/admin/role", requireAuth, roleAdminRoutes);

  // User routes
  router.use("/admin/user", requireAuth, userAdminRoutes);

  // Course routes
  router.use("/admin/course", requireAuth, courseAdminRoutes);

  // Section routes
  router.use("/admin/sections", requireAuth, sectionRoutes);

  // Lesson routes
  router.use("/admin/lessons", requireAuth, lessonRoutes);
  router.use("/admin/articles", requireAuth, articleAdminRoutes);

  // Article content routes for learners
  router.use("/articles", requireAuth, articleRoutes);

  // Lesson content routes for learners
  router.use("/lessons", requireAuth, publicLessonRoutes);

  // Lesson comment and submission routes
  router.use("/lesson-comments", requireAuth, submissionRoutes);

  // Course routes
  router.use("/admin/order", requireAuth, orderAdminRoutes);

  // Course routes
  router.use("/admin/attendance", requireAuth, attendanceRoutes);

  // Admin Banner routes
  // router.use("/admin/banner", requireAuth, bannerAdminRoutes);

  //public Banner routes
  // router.use("/banner", requireAuth, bannerRoutes);
  // setting routes
  router.use("/admin/setting", requireAuth, settingAdminRoutes);
  router.use("/setting", requireAuth, settingRoutes);
  return router;
};
