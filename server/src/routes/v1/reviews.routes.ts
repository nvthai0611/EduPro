import { Router } from "express";
import authenticateToken from "../../middlewares/auth/authenticateToken";
import { ReviewController } from '../../modules/review/review.controller';

const router = Router();

router.post("/", authenticateToken, ReviewController.create);
router.get("/course/:slug", ReviewController.getByCourseSlug);
router.delete("/:reviewId", authenticateToken, ReviewController.delete);
router.patch("/:reviewId", authenticateToken, ReviewController.update);

export const reviewRoutes = router;
