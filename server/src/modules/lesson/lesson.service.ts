import LessonRepository from "./lesson.repository";

class LessonService {

    
    async getLessonsByCourseId(courseId: string) {
        return LessonRepository.findLessonsByCourseId(courseId);
    }

    async getLessonsBySectionId(sectionId: string) {
        return LessonRepository.findLessonsBydLessonsBySectionId(sectionId);
    }
}