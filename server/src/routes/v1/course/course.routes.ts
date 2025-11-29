import {
  createCourse,
  getAllCourses,
  getCourseById,
  getCourseBySlug,
  getAllCoursesByInstructor,
  getCoursesByManager,
  updateCourse,
  deleteCourse,
  submitCourseForReview,
  reviewCourse,
  getCourseDetails,
} from "../../../modules/course/course.controller";
import { Router } from "express";

const router: Router = Router();

// Public routes
router.get("/", getAllCourses);
router.get("/slug/:slug", getCourseBySlug);

// Specific routes (must be before :id route)
router.get("/instructor/:instructorId", getAllCoursesByInstructor);
router.get("/manager/:managerId", getCoursesByManager);

// Protected routes (add auth middleware later)
router.post("/", createCourse);

// Dynamic routes (must be last)
router.get("/:id", getCourseById);
router.get("/:id/details", getCourseDetails);
router.patch("/:id", updateCourse);
router.delete("/:id", deleteCourse);
router.patch("/:id/submit", submitCourseForReview);
router.patch("/:id/review", reviewCourse);

export const courseRoutes: Router = router;