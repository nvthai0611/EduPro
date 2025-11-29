import Lesson from "./lesson.model";


class LessonRepository {
  async findLessonsByCourseId(courseId: string) {
    return Lesson.find({ courseId }).sort({ order: 1 }).exec();
  }
    async findLessonsBydLessonsBySectionId(sectionId: string) {
      return Lesson.find({ sectionId }).sort({ order: 1 }).exec();
    }
}
export default new LessonRepository();