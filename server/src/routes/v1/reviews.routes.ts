import { Router } from "express";
import authenticateToken from "../../middlewares/auth/authenticateToken";
import { ReviewController } from '../../modules/review/review.controller';

const router = Router();

// router.use(authenticateToken);

router.post("/", ReviewController.create);
router.get("/course/:slug", ReviewController.getByCourseSlug);
router.delete("/:reviewId", ReviewController.delete);
router.patch("/:reviewId", ReviewController.update);

export const reviewRoutes = router;
