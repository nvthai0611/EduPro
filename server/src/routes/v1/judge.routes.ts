import { Router } from "express";
import { ProblemController } from "../../modules/judge/problem/problem.controller";
import { SubmissionController } from "../../modules/judge/submission/submission.controller";
import authenticateToken from "../../middlewares/auth/authenticateToken";

const router = Router();

router.use(authenticateToken);

// PROBLEM ROUTER
router.get("/problems", ProblemController.getAll);

router.get("/problems/:slug", ProblemController.getBySlug);

// SUBMISSION ROUTER
router.post("/submissions/run", SubmissionController.runCode);

router.post("/submissions/submit", SubmissionController.submitCode);

router.post("/submissions/save", SubmissionController.saveSubmission);

router.get("/submissions/me", SubmissionController.getMySubmissions);

router.get("/submissions/:id", SubmissionController.getById);

router.get("/submissions/user/:userId/problem/:problemId", SubmissionController.getByUserAndProblem);

export const judgeRoutes: Router = router;
