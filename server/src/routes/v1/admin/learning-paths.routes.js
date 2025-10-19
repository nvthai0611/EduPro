const express = require("express");
const router = express.Router();
const {
  getLearningPaths,
  getLearningPathDetail,
  createLearningPath,
  updateLearningPath,
  deleteLearningPath,
  reorderCourses,
  addCourseToPath,
} = require("../../controllers/v1/admin/learningPath.controller");
const { authenticateToken } = require("../../middlewares/auth/authenticateToken");
const { authorizeRoles } = require("../../middlewares/auth/authorizeRoles");

// All routes require authentication and admin role
router.use(authenticateToken);
router.use(authorizeRoles(["admin"]));

router.get("/", getLearningPaths);
router.get("/:id", getLearningPathDetail);
router.post("/", createLearningPath);
router.put("/:id", updateLearningPath);
router.delete("/:id", deleteLearningPath);

// Course management in learning paths
router.put("/:id/courses/reorder", reorderCourses);
router.post("/:id/courses", addCourseToPath);

module.exports = router;
