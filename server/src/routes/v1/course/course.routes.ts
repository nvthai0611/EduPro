import {
  createCourse,
  getCourse,
  getCoursesByManager,
    getAllCourses,
} from "../../../controllers/v1/course/course.controller";
import { Router } from "express";

const router: Router = Router();

router.get("/", (req, res) => {
  res.send("Course API is working");
});
router.get("/all", getAllCourses);
router.post("/", createCourse);
router.get("/:id", getCourse);
router.get("/manager/:managerId", getCoursesByManager);

export const courseRoutes: Router = router;