import { Router } from "express";
import { getSectionsWithContentForLearners, getSectionsWithMinimalLessons, getSectionsWithMinimalLessonsPaginated } from "../../modules/section/section.controller";

const router: Router = Router();

// Public route - no authentication required for learners
router.get("/course/:courseId/content", getSectionsWithContentForLearners);
router.get("/course/:courseId/with-lessons", getSectionsWithContentForLearners);
// Lightweight route - chỉ trả về minimal fields cho list view (load all)
router.get("/course/:courseId/minimal", getSectionsWithMinimalLessons);
// Lightweight route + pagination (cho CourseDetail)
router.get("/course/:courseId/minimal/paginated", getSectionsWithMinimalLessonsPaginated);

export const publicSectionRoutes: Router = router;