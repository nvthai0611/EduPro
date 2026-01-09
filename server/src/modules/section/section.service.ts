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

    // Get sections with minimal lesson data (for list view - lightweight)
    async getSectionsWithMinimalLessons(courseId: string): Promise<any[]> {
        const sections = await SectionRepository.getSectionsByCourseId(courseId);
        
        // Helper function to extract YouTube video ID from URL
        const extractVideoId = (url: string): string | null => {
            if (!url) return null;
            
            // Support multiple YouTube URL formats
            const patterns = [
                /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
                /^([a-zA-Z0-9_-]{11})$/ // Direct video ID
            ];
            
            for (const pattern of patterns) {
                const match = url.match(pattern);
                if (match && match[1]) {
                    return match[1];
                }
            }
            return null;
        };
        
        // Populate lessons với chỉ các fields cần thiết
        const populatedSections = await Promise.all(
            sections.map(async (section: any) => {
                // Populate lessons với select minimal fields
                const populatedSection = await section.populate({
                    path: 'lessons',
                    select: '_id title type videoUrl videoDuration readingTime order isPreview isFree'
                });
                
                // Get articles với minimal fields
                const articles = await ArticleRepository.findArticlesBySection(section._id.toString());
                const minimalArticles = articles.map((article: any) => ({
                    _id: article._id,
                    title: article.title,
                    type: 'article',
                    readingTime: article.readingTime,
                    order: article.order,
                    isPreview: article.isPreview,
                    isFree: article.isFree
                }));
                
                // Merge lessons và articles - chỉ giữ minimal fields và extract videoId
                const combinedContent = [
                    ...(populatedSection.lessons || []).map((lesson: any) => {
                        // SAFEGUARD: Lessons từ lessons collection KHÔNG BAO GIỜ có type='article'
                        // Nếu có, đây là data bị sai trong DB - force về 'video'
                        const lessonType = lesson.type === 'article' ? 'video' : (lesson.type || 'video');
                        
                        return {
                            _id: lesson._id,
                            title: lesson.title,
                            type: lessonType, // Use corrected type
                            videoId: extractVideoId(lesson.videoUrl), // Extract videoId từ videoUrl
                            videoDuration: lesson.videoDuration,
                            readingTime: lesson.readingTime,
                            order: lesson.order,
                            isPreview: lesson.isPreview,
                            isFree: lesson.isFree
                        };
                    }),
                    ...minimalArticles
                ].sort((a, b) => (a.order || 0) - (b.order || 0));
                
                return {
                    _id: section._id,
                    title: section.title,
                    order: section.order,
                    courseId: section.courseId,
                    lessons: combinedContent
                };
            })
        );

        return populatedSections;
    }
}

export default new SectionService();