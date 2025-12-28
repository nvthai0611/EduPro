import { Router } from "express";
import { getSectionsWithContentForLearners, getSectionsWithMinimalLessons } from "../../modules/section/section.controller";
import authenticateToken from "../../middlewares/auth/authenticateToken";

const router: Router = Router();
router.use(authenticateToken);

// Public route - no authentication required for learners
router.get("/course/:courseId/content", getSectionsWithContentForLearners);
router.get("/course/:courseId/with-lessons", getSectionsWithContentForLearners);
// Lightweight route - chỉ trả về minimal fields cho list view
router.get("/course/:courseId/minimal", getSectionsWithMinimalLessons);

export const publicSectionRoutes: Router = router;