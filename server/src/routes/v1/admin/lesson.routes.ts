import { Router } from "express";
import {
  getLessonsByCourseId,
  getLessonsBySectionId,
  getLessonById,
  createLesson,
  updateLesson,
  deleteLesson,
  reorderLessons,
  // uploadVideo, // TODO: Uncomment when video upload is implemented
} from "../../../modules/lesson/lesson.controller";
import authenticateToken from "../../../middlewares/auth/authenticateToken";

const router: Router = Router();

// All lesson routes require authentication
router.use(authenticateToken);

// Lesson CRUD operations
router.post("/", createLesson); // Create new lesson
router.get("/course/:courseId", getLessonsByCourseId); // Get all lessons by course
router.get("/section/:sectionId", getLessonsBySectionId); // Get all lessons by section
router.get("/:lessonId", getLessonById); // Get lesson by ID
router.patch("/:lessonId", updateLesson); // Update lesson
router.delete("/:lessonId", deleteLesson); // Delete lesson (soft delete)

// Reordering
router.patch("/section/:sectionId/reorder", reorderLessons); // Reorder lessons in section

// TODO: Video upload endpoint - implement later
// router.post("/upload-video", uploadVideo); // Upload video to cloud storage

export const lessonRoutes: Router = router;
