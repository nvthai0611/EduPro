import { Router } from "express";
import progressController from "../../modules/progress/progress.controller";
import authenticateToken from "../../middlewares/auth/authenticateToken";

const router: Router = Router();

router.use(authenticateToken);

/**
 * GET progress của user trong course
 */
router.get("/:courseId", progressController.getProgress);

/**
 * Tick hoàn thành lesson
 */
router.post("/:courseId/lessons/:lessonId/complete", progressController.completeLesson);

/**
 * BỎ tick lesson
 */
router.delete("/:courseId/lessons/:lessonId/complete", progressController.uncompleteLesson);

export const progressRoutes: Router = router;
