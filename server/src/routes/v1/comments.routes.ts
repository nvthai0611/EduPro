import { Router } from "express";
import commentController from "../../modules/comment/comment.controller";

const router: Router = Router();

// Get comments (Lazy load)
// Query params: targetType, targetId
router.get("/", commentController.getComments);

export const commentRoutes: Router = router;
