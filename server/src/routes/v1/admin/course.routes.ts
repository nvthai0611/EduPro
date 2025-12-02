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
router.get("/all", getAllCourses);
router.post("/", authenticateToken, createCourse);
router.get("/:id", getCourseById);
router.get("/manager/:managerId", getCoursesByManager);


// Section Management


export const courseAdminRoutes: Router = router;