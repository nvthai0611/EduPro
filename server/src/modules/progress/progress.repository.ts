import Progress, { ProgressDocument } from "./progress.model";
import { Types } from "mongoose";

class ProgressRepository {
  findByUserAndCourse(
    userId: Types.ObjectId,
    courseId: Types.ObjectId
  ) {
    return Progress.findOne({ userId, courseId });
  }

  async findOrCreate(
    userId: Types.ObjectId,
    courseId: Types.ObjectId
  ): Promise<ProgressDocument> {
    let progress: any = await Progress.findOne({ userId, courseId });

    if (!progress) {
      progress = await Progress.create({
        userId,
        courseId,
        completedLessons: [],
      });
    }

    return progress;
  }
}

export default new ProgressRepository();
