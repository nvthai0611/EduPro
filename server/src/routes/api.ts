import { Router, Request, Response } from "express";
const router: Router = Router();
import { authRoutes } from "./v1/auth/auth.routes";

router.get("/", (req: Request, res: Response) => {
  res.send("check");
});

// // Authentication routes
router.use("/auth", authRoutes);

export const apiRouter: Router = router;
