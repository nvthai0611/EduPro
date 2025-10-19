const express = require("express");
const router = express.Router();
const {
  addComment,
  getLessonComments,
  getCommentReplies,
  toggleCommentLike,
  updateComment,
  deleteComment,
} = require("../../controllers/v1/comment.controller");
const { authenticateToken } = require("../../middlewares/auth/authenticateToken");

// All routes require authentication
router.use(authenticateToken);

router.post("/", addComment);
router.get("/lesson/:lessonId", getLessonComments);
router.get("/:id/replies", getCommentReplies);
router.put("/:id/like", toggleCommentLike);
router.put("/:id", updateComment);
router.delete("/:id", deleteComment);

module.exports = router;
