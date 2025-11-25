import { Router, Request, Response } from "express";
const router: Router = Router();
import { authRoutes } from "./v1/auth/auth.routes";
import User from "../models/user.model";

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

export const apiRouter: Router = router;
