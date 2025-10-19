const express = require("express");
const router = express.Router();
const {
  getLesson,
  markLessonComplete,
  getCourseLessons,
} = require("../../controllers/v1/lesson.controller");
const { authenticateToken } = require("../../middlewares/auth/authenticateToken");

// All routes require authentication
router.use(authenticateToken);

router.get("/course/:courseId", getCourseLessons);
router.get("/:id", getLesson);
router.post("/:id/complete", markLessonComplete);

module.exports = router;
