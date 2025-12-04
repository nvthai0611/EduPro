import {
  createCourse,
  getAllCourses,
  getCourseById,
  getCourseBySlug,
  getAllCoursesByInstructor,
  getCoursesByManager,
  updateCourse,
  deleteCourse,
  submitCourseForApproval,
  reviewCourse,
  getCourseDetails,
} from "../../../modules/course/course.controller";
import { Router } from "express";
import authenticateToken from "../../../middlewares/auth/authenticateToken";
import { getLessonsByCourseId } from "../../../modules/lesson/lesson.controller";

const router: Router = Router();

// Public routes
router.get("/", getAllCourses);
router.get("/slug/:slug", getCourseBySlug);

// Specific routes (must be before :id route)
router.get("/instructor/:instructorId", getAllCoursesByInstructor);
router.get("/manager/:managerId", getCoursesByManager);

// Protected routes (require authentication)
router.post("/", authenticateToken, createCourse);
router.patch("/:id", authenticateToken, updateCourse);
router.delete("/:id", authenticateToken, deleteCourse);
router.post("/:id/submit", authenticateToken, submitCourseForApproval);
router.patch("/:id/review", authenticateToken, reviewCourse);

// Dynamic routes (must be last)
router.get("/:id", getCourseById);
router.get("/:id/details", getCourseDetails);

router.get("/:courseId/lessons", getLessonsByCourseId); // Get all lessons by course

export const courseRoutes: Router = router;
