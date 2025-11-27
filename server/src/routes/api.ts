import { Router, Request, Response } from "express";
const router: Router = Router();
import { authRoutes } from "./v1/auth/auth.routes";
import { courseRoutes } from "./v1/course/course.routes";
// // Authentication routes
router.use("/auth", authRoutes);

router.use("/courses", courseRoutes);

export const apiRouter: Router = router;
