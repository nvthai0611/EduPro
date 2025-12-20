import { Router } from "express";
import authenticateToken from "../../middlewares/auth/authenticateToken";
import { authorizeRoles } from "../../middlewares/auth/authorizeRoles";
import {
  createComment,
  updateComment,
  getMyComment,
  getComments,
  teacherReply,
  deleteComment,
  updateReply,
  deleteReply,
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

// Delete student comment
router.delete("/:lessonId/comment", deleteComment);

// Update teacher reply by index
router.put("/:commentId/reply/:replyIndex", authorizeRoles(["admin", "manager", "instructor"]), updateReply);

// Delete teacher reply by index
router.delete("/:commentId/reply/:replyIndex", authorizeRoles(["admin", "manager", "instructor"]), deleteReply);

export const submissionRoutes: Router = router;
