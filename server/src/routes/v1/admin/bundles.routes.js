const express = require("express");
const router = express.Router();
const {
  getBundles,
  getBundleDetail,
  createBundle,
  updateBundle,
  deleteBundle,
  addCourseToBundle,
  removeCourseFromBundle,
} = require("../../controllers/v1/admin/bundle.controller");
const { authenticateToken } = require("../../middlewares/auth/authenticateToken");
const { authorizeRoles } = require("../../middlewares/auth/authorizeRoles");

// All routes require authentication and admin role
router.use(authenticateToken);
router.use(authorizeRoles(["admin"]));

router.get("/", getBundles);
router.get("/:id", getBundleDetail);
router.post("/", createBundle);
router.put("/:id", updateBundle);
router.delete("/:id", deleteBundle);

// Course management in bundles
router.post("/:id/courses", addCourseToBundle);
router.delete("/:id/courses/:courseId", removeCourseFromBundle);

module.exports = router;
