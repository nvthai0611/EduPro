import { Router } from "express";
import { AttendanceController } from "../../../modules/attendance/attendance.controller";
import { authorizeRoles } from "../../../middlewares/auth/authorizeRoles";
import authenticateToken from "../../../middlewares/auth/authenticateToken";

const router = Router();

router.use(authenticateToken);
router.use(authorizeRoles(["admin", "instructor"]));

router.post("/", AttendanceController.create);
router.get("/", AttendanceController.getByCourse);
router.get("/:id", AttendanceController.getDetail);
router.patch("/:id", AttendanceController.update);

export const attendanceRoutes: Router = router;
