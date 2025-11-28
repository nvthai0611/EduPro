import {
  createCourse,
  getCourse,
  // getCoursesByManager,,
    getAllCourses,
    // getAllCoursesByInstructor,
    submitCourseForReview,
    reviewCourse,
    updateCourse
} from "../../../modules/course/course.controller";
import { Router } from "express";

const router: Router = Router();
router.get("/", getAllCourses);
router.post("/",(req, res, next) => {
    req.user = { _id: "6924fceeb66f9b47480a96a0" };
    next();
  }, createCourse);
router.get("/:id", getCourse);
// router.get("/:instructorId", getAllCoursesByInstructor);
router.patch("/:id", updateCourse);
router.patch("/:id/submit", submitCourseForReview);
router.patch("/:id/review", reviewCourse);

export const courseRoutes: Router = router;