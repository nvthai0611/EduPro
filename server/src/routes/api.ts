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
import { lessonRoutes } from "./v1/admin/lesson.routes";
import { orderAdminRoutes } from "./v1/admin/order.route";

export const apiRouter = (io?: Server) => {
  // Authentication routes
  router.use("/auth", authRoutes);

  // Category routes
  router.use("/category", categoryRoutes);

  // Course routes
  router.use("/courses", courseRoutes);

  // Order routes
  router.use("/orders", orderRoutes);

  // User routes
  router.use("/users", userRoutes);

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
  // Course routes
  router.use("/admin/order", orderAdminRoutes);

  return router;
};
