import { Router } from "express";
import { getSectionsWithContentForLearners } from "../../modules/section/section.controller";

const router: Router = Router();

// Public route - no authentication required for learners
router.get("/course/:courseId/content", getSectionsWithContentForLearners);

export const publicSectionRoutes: Router = router;