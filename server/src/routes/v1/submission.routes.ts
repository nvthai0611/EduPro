import { Router } from "express";
import authenticateToken from "../../middlewares/auth/authenticateToken";
import { authorizeRoles } from "../../middlewares/auth/authorizeRoles";
import {
  createComment,
  updateComment,
  getMyComment,
  getComments,
  teacherReply,
} from "../../modules/submission/submission.controller";

const router: Router = Router();

// All routes require authentication
router.use(authenticateToken);

// Student creates a single comment (one per lesson)
router.post("/:lessonId/comment", createComment);

// Student updates their comment
router.put("/:lessonId/comment", updateComment);

// Get my comment for a lesson
router.get("/:lessonId/comment/my", getMyComment);

// Get all comments for a lesson (public for all authenticated users)
router.get("/:lessonId/comments", getComments);

// Teacher reply to a specific comment
router.post("/:commentId/reply", authorizeRoles(["admin", "manager", "instructor"]), teacherReply);

export const submissionRoutes: Router = router;
