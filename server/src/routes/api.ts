import { Router, Request, Response } from "express";
const router: Router = Router();
import { authRoutes } from "./v1/auth/auth.routes";
import { categoryRoutes } from "./v1/categories.routes";
import { roleRoutes } from "./v1/roles.routes";
import { userRoutes } from "./v1/users.routes";
import { courseRoutes } from "./v1/course/course.routes";
import { orderRoutes } from "./v1/order.route";
import { paymentRoutes }  from "./v1/payment.routes";
import { courseAdminRoutes } from "./v1/admin/course.routes";

// Authentication routes
router.use("/auth", authRoutes);

// Category routes
router.use("/category", categoryRoutes);

// Course routes
router.use("/courses", courseRoutes);

// Order routes
router.use("/orders", orderRoutes);

// Payment routes
router.use("/payment", paymentRoutes);

// Role routes
router.use("/admin/role", roleRoutes);

// User routes
router.use("/admin/user", userRoutes);

// Course routes
router.use("/admin/course", courseAdminRoutes);

export const apiRouter: Router = router;
