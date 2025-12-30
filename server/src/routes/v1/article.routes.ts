import { Router } from "express";
import authenticateToken from "../../middlewares/auth/authenticateToken";
import { getArticleContent } from "../../modules/article/article.controller";

const router = Router();

// Require authentication to access course articles
router.use(authenticateToken);

// Route for getting article content by articleId
router.get("/:articleId", getArticleContent);

export const articleRoutes = router;
