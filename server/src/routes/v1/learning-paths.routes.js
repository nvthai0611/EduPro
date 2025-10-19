const express = require("express");
const router = express.Router();
const {
  getLearningPaths,
  getLearningPathDetail,
  getLearningPathLevels,
} = require("../../controllers/v1/learningPathPublic.controller");

// Public routes - no authentication required
router.get("/", getLearningPaths);
router.get("/levels", getLearningPathLevels);
router.get("/:slug", getLearningPathDetail);

module.exports = router;
