import { Router } from "express";
import authenticateToken from "../../middlewares/auth/authenticateToken";
import answerController from "../../modules/answer/answer.controller";
import commentController from "../../modules/comment/comment.controller";

const router: Router = Router();

// Create comment on answer
router.post("/:id/comments", authenticateToken, commentController.createAnswerComment);

// Accept answer (Protected, logic checks for Post author)
router.post("/:id/acceptance", authenticateToken, answerController.acceptAnswer);

// Vote answer
router.post("/:id/vote", authenticateToken, answerController.voteAnswer);

export const answerRoutes: Router = router;
