import { Router } from "express";
import authenticateToken from "../../middlewares/auth/authenticateToken";
import { getArticleContent } from "../../modules/article/article.controller";

const router = Router();

// Require authentication to access course articles
router.use(authenticateToken);

router.get("/:lessonId", getArticleContent);

export const articleRoutes = router;
