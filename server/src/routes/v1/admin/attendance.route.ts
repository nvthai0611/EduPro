import { Router } from "express";
import { AttendanceController } from "../../../modules/attendance/attendance.controller";

const router = Router();

router.post("/", AttendanceController.create);
router.get("/", AttendanceController.getByCourse);
router.get("/:id", AttendanceController.getDetail);
router.patch("/:id", AttendanceController.update);

export const attendanceRoutes: Router = router;
