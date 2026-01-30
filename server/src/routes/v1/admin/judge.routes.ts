import { Router } from "express";
import { ProblemController } from "../../../modules/judge/problem/problem.controller";
import authenticateToken from "../../../middlewares/auth/authenticateToken";
import { authorizeRoles } from "../../../middlewares/auth/authorizeRoles";

const router = Router();

router.use(authenticateToken);
router.use(authorizeRoles(["admin", "instructor"]));

// PROBLEM ROUTER
router.post("/problems", ProblemController.create);

router.put("/problems/:id", ProblemController.update);

router.delete("/problems/:id", ProblemController.delete);

export const judgeAdminRoutes: Router = router;
