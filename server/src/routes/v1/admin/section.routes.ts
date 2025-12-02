import { Router } from "express";
import {
  createSection,
  getSectionsByCourseId,
  getSectionById,
  updateSection,
  deleteSection,
  addLessonToSection,
  removeLessonFromSection,
  reorderSections,
  getSectionsWithLessons,
} from "../../../modules/section/section.controller";
import authenticateToken from "../../../middlewares/auth/authenticateToken";

const router: Router = Router();

// All section routes require authentication
router.use(authenticateToken);

// Section CRUD operations
router.post("/", createSection); // Create new section
router.get("/course/:courseId", getSectionsByCourseId); // Get all sections by course
router.get("/course/:courseId/with-lessons", getSectionsWithLessons); // Get sections with populated lessons
router.get("/:sectionId", getSectionById); // Get section by ID
router.patch("/:sectionId", updateSection); // Update section
router.delete("/:sectionId", deleteSection); // Delete section (soft delete)

// Section-Lesson relationship operations
router.post("/:sectionId/lessons", addLessonToSection); // Add lesson to section
router.delete("/:sectionId/lessons", removeLessonFromSection); // Remove lesson from section

// Reordering
router.patch("/course/:courseId/reorder", reorderSections); // Reorder sections in course

export const sectionRoutes: Router = router;
