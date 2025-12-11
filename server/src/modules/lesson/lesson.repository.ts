import Lesson from "./lesson.model";


class LessonRepository {
  async findLessonsByCourseId(courseId: string) {
    return Lesson.find({ courseId, isDeleted: false })
      .sort({ order: 1 })
      .populate("sectionId", "title description")
      .exec();
  }

  async findLessonsBydLessonsBySectionId(sectionId: string) {
    return Lesson.find({ sectionId, isDeleted: false })
      .sort({ order: 1 })
      .exec();
  }

  // Additional repository methods can be added here
  async findLessonById(lessonId: string) {
    return Lesson.findOne({ _id: lessonId, isDeleted: false }).exec();
  }

  async findLessonByIdIncludingDeleted(lessonId: string) {
    return Lesson.findById(lessonId).exec();
  }

  async createLesson(data: Partial<any>) {
    const lesson = new Lesson(data);
    return lesson.save();
  }

  async updateLesson(lessonId: string, data: Partial<any>) {
    return Lesson.findOneAndUpdate({ _id: lessonId, isDeleted: false }, data, {
      new: true,
    }).exec();
  }

  async deleteLesson(lessonId: string) {
    return Lesson.findOneAndUpdate(
      { _id: lessonId, isDeleted: false },
      { isDeleted: true },
      { new: true }
    ).exec();
  }

  async getMaxOrderInSection(sectionId: string) {
    const lastLesson = await Lesson.findOne({ sectionId, isDeleted: false })
      .sort({ order: -1 })
      .select("order")
      .lean()
      .exec();
    return lastLesson?.order ?? 0;
  }

  async findPublishedArticleById(lessonId: string) {
    return Lesson.findOne({
      _id: lessonId,
      type: "article",
      isDeleted: false,
      isPublished: true,
    })
      .lean()
      .exec();
  }

  async findArticlesBySection(sectionId: string) {
    return Lesson.find({
      sectionId,
      type: "article",
      isDeleted: false,
    })
      .sort({ order: 1 })
      .lean()
      .exec();
  }
}

export default new LessonRepository();