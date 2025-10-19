const express = require("express");
const router = express.Router();
const {
  getCourses,
  getCourseDetail,
  getCoursePreview,
  getCourseCategories,
} = require("../../controllers/v1/coursePublic.controller");

// Public routes - no authentication required
router.get("/", getCourses);
router.get("/categories", getCourseCategories);
router.get("/:slug", getCourseDetail);
router.get("/:slug/preview", getCoursePreview);

module.exports = router;
