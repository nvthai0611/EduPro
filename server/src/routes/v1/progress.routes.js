const express = require("express");
const router = express.Router();
const {
  getCourseProgress,
  updateCourseProgress,
  getAllProgress,
  getLearningStats,
} = require("../../controllers/v1/progress.controller");
const { authenticateToken } = require("../../middlewares/auth/authenticateToken");

// All routes require authentication
router.use(authenticateToken);

router.get("/stats", getLearningStats);
router.get("/all", getAllProgress);
router.get("/:courseId", getCourseProgress);
router.put("/:courseId/update", updateCourseProgress);

module.exports = router;
