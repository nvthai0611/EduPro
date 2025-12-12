import { Router } from "express";
import authenticateToken from "../../../middlewares/auth/authenticateToken";
import { authorizeRoles } from "../../../middlewares/auth/authorizeRoles";
import {
  createArticleLesson,
  getArticleLesson,
  getArticlesBySection,
  updateArticleLesson,
  deleteArticleLesson,
  reorderArticles,
  searchArticles,
} from "../../../modules/article/article.controller";

const router = Router();

router.use(authenticateToken);
router.use(authorizeRoles(["admin", "instructor"]));

router.get("/search", searchArticles);
router.get("/section/:sectionId", getArticlesBySection);
router.patch("/section/:sectionId/reorder", reorderArticles);
router.get("/:lessonId", getArticleLesson);
router.post("/", createArticleLesson);
router.patch("/:lessonId", updateArticleLesson);
router.delete("/:lessonId", deleteArticleLesson);

export const articleAdminRoutes = router;
