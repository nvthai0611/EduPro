import { Router } from "express";
import { ProblemController } from "../../modules/judge/problem/problem.controller";
import { SubmissionController } from "../../modules/judge/submission/submission.controller";

const router = Router();

// PROBLEM ROUTER
router.get("/problems", ProblemController.getAll);

router.get("/problems/:slug", ProblemController.getBySlug);

// SUBMISSION ROUTER
router.post("/submissions/run", SubmissionController.runCode);

router.post("/submissions/submit", SubmissionController.submitCode);

router.get("/submissions/me", SubmissionController.getMySubmissions);

router.get("/submissions/:id", SubmissionController.getById);

export const judgeRoutes: Router = router;
