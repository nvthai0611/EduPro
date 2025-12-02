import authenticateToken from "../../../middlewares/auth/authenticateToken";
import {
  createCourse,
  getCourseById,
  getCoursesByManager,
  getAllCourses,
} from "../../../modules/course/course.controller";
import { Router } from "express";

const router: Router = Router();

router.get("/", (req, res) => {
  res.send("Course API is working");
});
router.get("/all", authenticateToken, getAllCourses);
router.post("/", authenticateToken, createCourse);
router.get("/:id", authenticateToken, getCourseById);
router.get("/manager/:managerId", authenticateToken, getCoursesByManager);


// Section Management


export const courseAdminRoutes: Router = router;