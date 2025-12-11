import Section from "./section.model";
import SectionRepository from "./section.repository";
import ArticleRepository from "../article/article.repository";
import { Types } from "mongoose";


class SectionService {
  // create a new section
  async createSection(data: Partial<any>): Promise<any> {
    const section = new Section(data);
    return section.save();
  }
  // get sections by courseId
  async getSectionsByCourseId(courseId: string): Promise<any[]> {
    return SectionRepository.getSectionsByCourseId(courseId);
  }
    // get section by id
    async getSectionById(sectionId: string): Promise<any | null> {
      return SectionRepository.getSectionById(sectionId);
    }
    // update section
    async updateSection(sectionId: string, data: Partial<any>): Promise<any | null> {
        return SectionRepository.updateSection(sectionId, data);
    }
    // delete section (soft delete)
    async deleteSection(sectionId: string): Promise<any | null> {
        return SectionRepository.deleteSection(sectionId);
    }
    // add lesson to section
    async addLessonToSection(sectionId: string, lessonId: Types.ObjectId): Promise<any | null> {
        return SectionRepository.addLessonToSection(sectionId, lessonId);
    }
    // remove lesson from section
    async removeLessonFromSection(sectionId: string, lessonId: Types.ObjectId): Promise<any | null> {
        return SectionRepository.removeLessonFromSection(sectionId, lessonId);
    }

    // Reorder sections within a course
    async reorderSections(courseId: string, sectionIds: string[]): Promise<any[]> {
        // Validate that all sections belong to the course
        const sections = await SectionRepository.getSectionsByCourseId(courseId);
        const validSectionIds = sections.map((s: any) => s._id.toString());
        
        const isValid = sectionIds.every(id => validSectionIds.includes(id));
        if (!isValid) {
            throw new Error("Invalid section IDs or sections don't belong to this course");
        }

        // Update order for each section
        const updatePromises = sectionIds.map((sectionId, index) => 
            SectionRepository.updateSection(sectionId, { order: index + 1 })
        );

        await Promise.all(updatePromises);
        return await SectionRepository.getSectionsByCourseId(courseId);
    }

    // Get sections with populated lessons and articles
    async getSectionsWithLessons(courseId: string): Promise<any[]> {
        const sections = await SectionRepository.getSectionsByCourseId(courseId);
        
        // Populate lessons and get articles for each section
        const populatedSections = await Promise.all(
            sections.map(async (section: any) => {
                // Populate lessons
                const populatedSection = await section.populate('lessons');
                
                // Get articles for this section
                const articles = await ArticleRepository.findArticlesBySection(section._id.toString());
                
                // Merge lessons and articles into a combined array, sorted by order
                const combinedContent = [
                    ...(populatedSection.lessons || []).map((lesson: any) => ({
                        ...lesson.toObject(),
                        type: lesson.type || 'video'
                    })),
                    ...articles.map((article: any) => ({
                        ...article.toObject(),
                        type: 'article'
                    }))
                ].sort((a, b) => (a.order || 0) - (b.order || 0));
                
                return {
                    ...populatedSection.toObject(),
                    lessons: combinedContent // Replace lessons array with combined content
                };
            })
        );

        return populatedSections;
    }
}

export default new SectionService();