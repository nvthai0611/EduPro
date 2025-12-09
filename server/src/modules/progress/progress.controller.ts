import { Request, Response } from "express";
import progressService from "./progress.service";

// Get course progress for a specific user and course
export const getCourseProgress = async (req: Request, res: Response): Promise<void> => {
  try {
    const { courseId } = req.params;
    const userId = (req as any).user.userId;

    const progress = await progressService.getCourseProgress(userId, courseId);

    res.json({
      success: true,
      data: progress
    });
  } catch (error: any) {
    console.error("Error in getCourseProgress:", error);
    res.status(500).json({
      success: false,
      message: "Không thể lấy tiến độ khóa học",
      error: error.message
    });
  }
};

// Update course progress
export const updateCourseProgress = async (req: Request, res: Response): Promise<void> => {
  try {
    const { courseId } = req.params;
    const userId = (req as any).user.userId;
    const { lessonId, progress, completedLessons } = req.body;

    const courseProgress = await progressService.updateCourseProgress(userId, courseId, {
      lessonId,
      progress,
      completedLessons
    });

    res.json({
      success: true,
      message: "Cập nhật tiến độ thành công",
      data: courseProgress
    });
  } catch (error: any) {
    console.error("Error in updateCourseProgress:", error);
    res.status(500).json({
      success: false,
      message: "Không thể cập nhật tiến độ",
      error: error.message
    });
  }
};

// Get all progress for admin (student progress tracking)
export const getAllProgress = async (req: Request, res: Response): Promise<void> => {
  try {
    const { courseId, userId, progressFilter } = req.query;

    const progressData = await progressService.getAllProgress({
      courseId: courseId as string,
      userId: userId as string,
      progressFilter: progressFilter as string
    });

    res.json({
      success: true,
      data: progressData
    });
  } catch (error: any) {
    console.error("Error in getAllProgress:", error);
    res.status(500).json({
      success: false,
      message: "Không thể lấy danh sách tiến độ",
      error: error.message
    });
  }
};

// Get learning stats for dashboard
export const getLearningStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;

    const stats = await progressService.getLearningStats(userId);

    res.json({
      success: true,
      data: stats
    });
  } catch (error: any) {
    console.error("Error in getLearningStats:", error);
    res.status(500).json({
      success: false,
      message: "Không thể lấy thống kê học tập",
      error: error.message
    });
  }
};

// Issue certificate to student
export const issueCertificate = async (req: Request, res: Response): Promise<void> => {
  try {
    const { progressId } = req.params;

    const progress = await progressService.issueCertificate(progressId);

    res.json({
      success: true,
      message: "Cấp chứng chỉ thành công",
      data: progress
    });
  } catch (error: any) {
    console.error("Error in issueCertificate:", error);
    
    if (error.message.includes("Không tìm thấy") || error.message.includes("chưa hoàn thành") || error.message.includes("đã được cấp")) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Không thể cấp chứng chỉ",
        error: error.message
      });
    }
  }
};
