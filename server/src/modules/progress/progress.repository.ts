import Progress, { IProgressDocument, IProgress } from "./progress.model";
import { Types } from "mongoose";

export class ProgressRepository {
  // Find progress by userId and courseId
  async findByUserAndCourse(userId: Types.ObjectId | string, courseId: Types.ObjectId | string): Promise<IProgressDocument | null> {
    return await Progress.findOne({ userId, courseId })
      .populate('courseId', 'title thumbnail totalLessons');
  }

  // Create new progress
  async create(data: {
    userId: Types.ObjectId | string;
    courseId: Types.ObjectId | string;
    progress?: number;
    completedLessons?: Types.ObjectId[];
    lastAccessedLesson?: Types.ObjectId | string;
  }): Promise<IProgressDocument> {
    return await Progress.create(data);
  }

  // Update progress
  async update(progressId: Types.ObjectId | string, data: Partial<IProgress>): Promise<IProgressDocument | null> {
    return await Progress.findByIdAndUpdate(
      progressId,
      data,
      { new: true }
    ).populate('courseId', 'title thumbnail totalLessons');
  }

  // Find all progress with filters
  async findAll(filters: {
    courseId?: Types.ObjectId | string;
    userId?: Types.ObjectId | string;
    progress?: number | { $gt?: number; $lt?: number };
  } = {}): Promise<IProgressDocument[]> {
    return await Progress.find(filters)
      .populate('userId', 'fullName email image')
      .populate('courseId', 'title thumbnail totalLessons')
      .sort({ updatedAt: -1 });
  }

  // Find all progress by userId
  async findByUserId(userId: Types.ObjectId | string): Promise<IProgressDocument[]> {
    return await Progress.find({ userId })
      .populate('courseId', 'title thumbnail totalLessons');
  }

  // Find by id
  async findById(progressId: Types.ObjectId | string): Promise<IProgressDocument | null> {
    return await Progress.findById(progressId)
      .populate('userId', 'fullName email image')
      .populate('courseId', 'title thumbnail totalLessons');
  }

  // Delete progress
  async delete(progressId: Types.ObjectId | string): Promise<IProgressDocument | null> {
    return await Progress.findByIdAndDelete(progressId);
  }

  // Count progress by filters
  async count(filters: any = {}): Promise<number> {
    return await Progress.countDocuments(filters);
  }
}

export default new ProgressRepository();
