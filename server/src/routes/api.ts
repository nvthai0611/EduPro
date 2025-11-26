import { Router, Request, Response } from "express";
const router: Router = Router();
import { authRoutes } from "./v1/auth/auth.routes";
import User from "../models/user.model";
import {courseRoutes}  from "./v1/course/course.routes";
router.get("/", async (req: Request, res: Response) => {
  try {
    const users = await User.findOne({email: "nguyenquangthuan190820@gmail.com"});
    console.log(users);
    res.json({
      success: true,
      data: users
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});
// // Authentication routes
router.use("/auth", authRoutes);

router.use("/courses", courseRoutes );

export const apiRouter: Router = router;
