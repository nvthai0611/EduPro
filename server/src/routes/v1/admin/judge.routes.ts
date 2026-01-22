import { Router } from "express";
import { ProblemController } from "../../../modules/judge/problem/problem.controller";

const router = Router();

// PROBLEM ROUTER
router.post("/problems", ProblemController.create);

router.put("/problems/:id", ProblemController.update);

router.delete("/problems/:id", ProblemController.delete);

export const judgeAdminRoutes: Router = router;
