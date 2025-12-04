import LessonRepository from "./lesson.repository";

class LessonService {

    
    async getLessonsByCourseId(courseId: string) {
        return LessonRepository.findLessonsByCourseId(courseId);
    }

    async getLessonsBySectionId(sectionId: string) {
        return LessonRepository.findLessonsBydLessonsBySectionId(sectionId);
    }

    // Additional service methods can be added here
    async getLessonById(lessonId: string) {
        return LessonRepository.findLessonById(lessonId);
    }
    async createLesson(data: Partial<any>) {
        return LessonRepository.createLesson(data);
    }
    async updateLesson(lessonId: string, data: Partial<any>) {
        return LessonRepository.updateLesson(lessonId, data);
    }
    async deleteLesson(lessonId: string) {
        return LessonRepository.deleteLesson(lessonId);
    }

    // Reorder lessons within a section
    async reorderLessons(sectionId: string, lessonIds: string[]) {
        // Validate that all lessons belong to the section
        const lessons = await LessonRepository.findLessonsBydLessonsBySectionId(sectionId);
        const validLessonIds = lessons.map((l: any) => l._id.toString());
        
        const isValid = lessonIds.every(id => validLessonIds.includes(id));
        if (!isValid) {
            throw new Error("Invalid lesson IDs or lessons don't belong to this section");
        }

        // Update order for each lesson
        const updatePromises = lessonIds.map((lessonId, index) => 
            LessonRepository.updateLesson(lessonId, { order: index + 1 })
        );

        await Promise.all(updatePromises);
        return await LessonRepository.findLessonsBydLessonsBySectionId(sectionId);
    }

    // TODO: Upload video to cloud storage (Cloudinary/AWS S3)
    // async uploadVideo(file: any) {
    //     // Implementation for video upload will be added later
    //     // This will handle:
    //     // - Video upload to cloud storage
    //     // - Generate video URL
    //     // - Extract video duration
    //     // - Return video metadata
    //     throw new Error("Video upload not implemented yet");
    // }

}

export default new LessonService();