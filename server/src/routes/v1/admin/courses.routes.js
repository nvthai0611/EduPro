const express = require("express");
const router = express.Router();
const {
  getCourses,
  getCourseDetail,
  createCourse,
  updateCourse,
  deleteCourse,
  addModule,
  addLesson,
} = require("../../controllers/v1/admin/course.controller");
const { authenticateToken } = require("../../middlewares/auth/authenticateToken");
const { authorizeRoles } = require("../../middlewares/auth/authorizeRoles");

// All routes require authentication and admin role
router.use(authenticateToken);
router.use(authorizeRoles(["admin"]));

router.get("/", getCourses);
router.get("/:id", getCourseDetail);
router.post("/", createCourse);
router.put("/:id", updateCourse);
router.delete("/:id", deleteCourse);

// Module management
router.post("/:id/modules", addModule);

// Lesson management
router.post("/modules/:id/lessons", addLesson);

module.exports = router;
