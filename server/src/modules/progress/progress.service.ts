import progressRepository from "./progress.repository";
import { Types } from "mongoose";
import { IProgressDocument } from "./progress.model";

export class ProgressService {
  // Get course progress for a specific user
  async getCourseProgress(userId: Types.ObjectId | string, courseId: Types.ObjectId | string): Promise<IProgressDocument> {
    let progress = await progressRepository.findByUserAndCourse(userId, courseId);

    if (!progress) {
      // Create default progress if not exists
      progress = await progressRepository.create({
        userId,
        courseId,
        progress: 0,
        completedLessons: [],
      });

      progress = await progressRepository.findByUserAndCourse(userId, courseId);
    }

    return progress!;
  }

  // Update course progress
  async updateCourseProgress(
    userId: Types.ObjectId | string,
    courseId: Types.ObjectId | string,
    data: {
      lessonId?: Types.ObjectId | string;
      progress?: number;
      completedLessons?: Types.ObjectId[];
    }
  ): Promise<IProgressDocument> {
    let progress = await progressRepository.findByUserAndCourse(userId, courseId);

    if (!progress) {
      progress = await progressRepository.create({
        userId,
        courseId,
        progress: data.progress || 0,
        completedLessons: data.completedLessons || [],
        lastAccessedLesson: data.lessonId as Types.ObjectId,
      });
    } else {
      const updateData: Partial<IProgressDocument> = {};
      
      if (data.progress !== undefined) updateData.progress = data.progress;
      if (data.completedLessons) updateData.completedLessons = data.completedLessons;
      if (data.lessonId) updateData.lastAccessedLesson = data.lessonId as Types.ObjectId;

      progress = await progressRepository.update(progress._id as Types.ObjectId, updateData);
    }

    return progress!;
  }

  // Get all progress (for admin)
  async getAllProgress(filters: {
    courseId?: string;
    userId?: string;
    progressFilter?: string;
  } = {}) {
    const query: any = {};

    if (filters.courseId) query.courseId = filters.courseId;
    if (filters.userId) query.userId = filters.userId;

    // Apply progress filter
    if (filters.progressFilter === 'completed') {
      query.progress = 100;
    } else if (filters.progressFilter === 'in-progress') {
      query.progress = { $gt: 0, $lt: 100 };
    } else if (filters.progressFilter === 'not-started') {
      query.progress = 0;
    }

    const progressData = await progressRepository.findAll(query);

    // Transform data to match frontend expectations
    return progressData.map((item: any) => ({
      _id: item._id,
      user: {
        _id: item.userId._id,
        fullName: item.userId.fullName,
        email: item.userId.email,
        image: item.userId.image || 'https://via.placeholder.com/40x40'
      },
      course: {
        _id: item.courseId._id,
        title: item.courseId.title,
        thumbnail: item.courseId.thumbnail || 'https://via.placeholder.com/60x40'
      },
      progress: item.progress || 0,
      completedLessons: item.completedLessons?.length || 0,
      totalLessons: item.courseId.totalLessons || 0,
      enrolledAt: item.createdAt,
      lastActivity: item.updatedAt,
      certificate: {
        issued: item.progress === 100 && item.certificateIssued,
        issuedAt: item.certificateIssuedAt
      }
    }));
  }

  // Get learning stats
  async getLearningStats(userId: Types.ObjectId | string) {
    const allProgress = await progressRepository.findByUserId(userId);

    return {
      totalCourses: allProgress.length,
      completedCourses: allProgress.filter(p => p.progress === 100).length,
      inProgressCourses: allProgress.filter(p => p.progress > 0 && p.progress < 100).length,
      totalLessonsCompleted: allProgress.reduce((sum, p) => sum + (p.completedLessons?.length || 0), 0),
      averageProgress: allProgress.length > 0
        ? Math.round(allProgress.reduce((sum, p) => sum + (p.progress || 0), 0) / allProgress.length)
        : 0
    };
  }

  // Issue certificate
  async issueCertificate(progressId: Types.ObjectId | string): Promise<IProgressDocument> {
    const progress = await progressRepository.findById(progressId);

    if (!progress) {
      throw new Error("Không tìm thấy tiến độ học tập");
    }

    if (progress.progress !== 100) {
      throw new Error("Học viên chưa hoàn thành khóa học");
    }

    if (progress.certificateIssued) {
      throw new Error("Chứng chỉ đã được cấp");
    }

    const updated = await progressRepository.update(progressId, {
      certificateIssued: true,
      certificateIssuedAt: new Date(),
    });

    return updated!;
  }
}

export default new ProgressService();
