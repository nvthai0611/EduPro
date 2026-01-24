import { Types } from "mongoose";
import progressRepo from "./progress.repository";

class ProgressService {
  async completeLesson(
    userId: Types.ObjectId,
    courseId: Types.ObjectId,
    lessonId: Types.ObjectId | string
  ) {
    const progress = await progressRepo.findOrCreate(
      userId,
      courseId
    );

    return progress.markLessonCompleted(lessonId);
  }

  async uncompleteLesson(
    userId: Types.ObjectId,
    courseId: Types.ObjectId,
    lessonId: Types.ObjectId | string
  ) {
    const progress = await progressRepo.findOrCreate(
      userId,
      courseId
    );

    return progress.unmarkLessonCompleted(lessonId);
  }

  async getProgress(
    userId: Types.ObjectId,
    courseId: Types.ObjectId
  ) {
    return progressRepo.findByUserAndCourse(userId, courseId);
  }
}

export default new ProgressService();
