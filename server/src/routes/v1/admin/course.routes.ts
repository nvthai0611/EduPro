import authenticateToken from "../../../middlewares/auth/authenticateToken";
import { authorizeRoles } from "../../../middlewares/auth/authorizeRoles";
import {
  createCourse,
  getCourseById,
  getCoursesByManager,
  getAllCoursesAdmin,
} from "../../../modules/course/course.controller";
import { Router } from "express";

const router: Router = Router();

router.get("/", (req, res) => {
  res.send("Course API is working");
});

// Admin routes - Yêu cầu authentication + admin role
router.get("/all", authenticateToken, authorizeRoles(["admin", "manager"]), getAllCoursesAdmin);
router.post("/", authenticateToken, authorizeRoles(["admin", "manager"]), createCourse);
router.get("/:id", authenticateToken, authorizeRoles(["admin", "manager"]), getCourseById);
router.get("/manager/:managerId", authenticateToken, authorizeRoles(["admin", "manager"]), getCoursesByManager);
router.get("/courses", authenticateToken, authorizeRoles(["admin", "manager"]), getAllCoursesAdmin);

// Section Management


export const courseAdminRoutes: Router = router;