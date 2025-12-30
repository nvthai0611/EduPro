import { encryptData } from "../../utils/encryption";
import SectionService from "./section.service";

export const createSection = async (req: any, res: any) => {
  try {
    const data = req.body;
    const section = await SectionService.createSection(data);
    res.status(201).json({ success: true, data: section });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getSectionsByCourseId = async (req: any, res: any) => {
  try {
    const courseId = req.params.courseId;
    const sections = await SectionService.getSectionsByCourseId(courseId);
    res.status(200).json({ success: true, data: sections });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getSectionById = async (req: any, res: any) => {
  try {
    const sectionId = req.params.sectionId;
    const section = await SectionService.getSectionById(sectionId);
    if (!section) {
      return res.status(404).json({ success: false, message: "Section not found" });
    }
    res.status(200).json({ success: true, data: section });
    } catch (error: any) {  
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateSection = async (req: any, res: any) => {
  try {
    const sectionId = req.params.sectionId;
    const data = req.body;
    const updatedSection = await SectionService.updateSection(sectionId, data);
    if (!updatedSection) {
      return res.status(404).json({ success: false, message: "Section not found" });
    }
    res.status(200).json({ success: true, data: updatedSection });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteSection = async (req: any, res: any) => {
  try {
    const sectionId = req.params.sectionId;
    const deletedSection = await SectionService.deleteSection(sectionId);
    if (!deletedSection) {
      return res.status(404).json({ success: false, message: "Section not found" });
    }
    res.status(200).json({ success: true, data: deletedSection });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const addLessonToSection = async (req: any, res: any) => {
  try {
    const sectionId = req.params.sectionId;
    const { lessonId } = req.body;
    const updatedSection = await SectionService.addLessonToSection(sectionId, lessonId);
    if (!updatedSection) {
      return res.status(404).json({ success: false, message: "Section not found" });
    }
    res.status(200).json({ success: true, data: updatedSection });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const removeLessonFromSection = async (req: any, res: any) => {
  try {
    const sectionId = req.params.sectionId;
    const { lessonId } = req.body;
    const updatedSection = await SectionService.removeLessonFromSection(sectionId, lessonId);
    if (!updatedSection) {
      return res.status(404).json({ success: false, message: "Section not found" });
    }
    res.status(200).json({ success: true, data: updatedSection });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Reorder sections in course
export const reorderSections = async (req: any, res: any) => {
  try {
    const courseId = req.params.courseId;
    const { sectionIds } = req.body; // Array of section IDs in new order
    
    if (!Array.isArray(sectionIds) || sectionIds.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: "sectionIds must be a non-empty array" 
      });
    }

    const updatedSections = await SectionService.reorderSections(courseId, sectionIds);
    res.status(200).json({ 
      success: true, 
      data: updatedSections,
      message: "Sections reordered successfully"
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get sections with populated lessons
export const getSectionsWithLessons = async (req: any, res: any) => {
  try {
    const courseId = req.params.courseId;
    const sections = await SectionService.getSectionsWithLessons(courseId);
    res.setHeader("x-encrypted", "true");
    res.status(200).json({ success: true, encryptedData: encryptData(sections) });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Public endpoint - Get sections with content for learners (no auth required)
export const getSectionsWithContentForLearners = async (req: any, res: any) => {
  try {
    const courseId = req.params.courseId;
    const sections = await SectionService.getSectionsWithLessons(courseId);
    res.setHeader("x-encrypted", "true");
    res.status(200).json({ success: true, encryptedData: encryptData(sections) });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Public endpoint - Get sections with minimal lesson data for list view (lightweight)
export const getSectionsWithMinimalLessons = async (req: any, res: any) => {
  try {
    const courseId = req.params.courseId;
    const sections = await SectionService.getSectionsWithMinimalLessons(courseId);
    res.setHeader("x-encrypted", "true");
    res.status(200).json({ success: true, encryptedData: encryptData(sections) });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};