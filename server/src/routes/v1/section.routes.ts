import { Router } from "express";
import { getSectionsWithContentForLearners } from "../../modules/section/section.controller";
import authenticateToken from "../../middlewares/auth/authenticateToken";

const router: Router = Router();
router.use(authenticateToken);

// Public route - no authentication required for learners
router.get("/course/:courseId/content", getSectionsWithContentForLearners);
router.get("/course/:courseId/with-lessons", getSectionsWithContentForLearners);

export const publicSectionRoutes: Router = router;