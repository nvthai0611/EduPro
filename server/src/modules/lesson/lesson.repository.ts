import Lesson from "./lesson.model";


class LessonRepository {
  async findLessonsByCourseId(courseId: string) {
    return Lesson.find({ courseId }).sort({ order: 1 }).populate("sectionId", "title description").exec();
  }
    async findLessonsBydLessonsBySectionId(sectionId: string) {
      return Lesson.find({ sectionId }).sort({ order: 1 }).exec();
    }

    // Additional repository methods can be added here
    async findLessonById(lessonId: string) {
      return Lesson.findById(lessonId).exec();
    }
    async createLesson(data: Partial<any>) {
      const lesson = new Lesson(data);
      return lesson.save();
    }
    async updateLesson(lessonId: string, data: Partial<any>) {
      return Lesson.findByIdAndUpdate(lessonId, data, { new: true }).exec();
    }
    async deleteLesson(lessonId: string) {
      return Lesson.findByIdAndUpdate(
        lessonId,
        { isDeleted: true },  
        { new: true }
      ).exec();
    }
    
}
export default new LessonRepository();