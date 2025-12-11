import { Router } from "express";
import authenticateToken from "../../../middlewares/auth/authenticateToken";
import { authorizeRoles } from "../../../middlewares/auth/authorizeRoles";
import {
  createArticleLesson,
  getArticleLesson,
  getArticlesBySection,
  updateArticleLesson,
} from "../../../modules/article/article.controller";

const router = Router();

router.use(authenticateToken);
router.use(authorizeRoles(["admin", "instructor"]));

router.get("/section/:sectionId", getArticlesBySection);
router.get("/:lessonId", getArticleLesson);
router.post("/", createArticleLesson);
router.patch("/:lessonId", updateArticleLesson);

export const articleAdminRoutes = router;
