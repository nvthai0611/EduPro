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

}

export default new LessonService();