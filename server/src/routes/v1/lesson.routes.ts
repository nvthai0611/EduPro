import { Router } from "express";
import authenticateToken from "../../middlewares/auth/authenticateToken";
import { getLessonContent } from "../../modules/lesson/lesson.controller";

const router = Router();

// Require authentication to access lessons
router.use(authenticateToken);

// Public route for learners to get lesson content
router.get("/:lessonId", getLessonContent);

export const lessonRoutes = router;
