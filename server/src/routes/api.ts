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
import { reviewRoutes } from "./v1/reviews.routes";

export const apiRouter = (io?: Server) => {
  // Block direct browser access to API
  // router.use(blockDirectAccess);

  // Authentication routes
  router.use("/auth", authRoutes);

  // Category routes
  router.use("/category", categoryRoutes);

  // Course routes (public with optional auth + rate limiting)
  router.use("/courses", courseRoutes);

  // Public sections routes (for learners)
  router.use("/sections", publicSectionRoutes);

  // Public lesson routes (for learners to view lesson content)
  router.use("/lessons", publicLessonRoutes);

  // Order routes
  router.use("/orders", orderRoutes);

  // User routes
  router.use("/users", userRoutes);

  // Review routes
  router.use("/reviews", reviewRoutes);

  // Payment routes
  router.use("/payment", paymentRoutes(io));

  // Role routes
  router.use("/admin/role", roleAdminRoutes);

  // User routes
  router.use("/admin/user", userAdminRoutes);

  // Course routes
  router.use("/admin/course", courseAdminRoutes);

  // Section routes
  router.use("/admin/sections", sectionRoutes);

  // Lesson routes
  router.use("/admin/lessons", lessonRoutes);
  router.use("/admin/articles", articleAdminRoutes);

  // Article content routes for learners
  router.use("/articles", articleRoutes);

  // Lesson content routes for learners
  router.use("/lessons", publicLessonRoutes);

  // Lesson comment and submission routes
  router.use("/lesson-comments", submissionRoutes);

  // Course routes
  router.use("/admin/order", orderAdminRoutes);

  // Course routes
  router.use("/admin/attendance", attendanceRoutes);

  // Admin Banner routes
  // router.use("/admin/banner", bannerAdminRoutes);

  //public Banner routes
  // router.use("/banner", bannerRoutes);
  // setting routes
  router.use("/admin/setting", settingAdminRoutes);
  router.use("/setting", settingRoutes);
  return router;
};
