const express = require("express");
const router = express.Router();
const {
  getCourseReviews,
  getCourseRatingStats,
} = require("../../controllers/v1/reviewPublic.controller");

// Public routes - no authentication required
router.get("/:courseId", getCourseReviews);
router.get("/:courseId/stats", getCourseRatingStats);

module.exports = router;
