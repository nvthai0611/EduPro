import { encryptData } from "../../utils/encryption";
import LessonService from "./lesson.service";

export const getLessonsByCourseId = async (req: any, res: any) => {
  try {
    const courseId = req.params.courseId;
    const lessons = await LessonService.getLessonsByCourseId(courseId);
    res.setHeader("x-encrypted", "true");
    return res
      .status(200)
      .json({ success: true, encryptedData: encryptData(lessons) });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getLessonsBySectionId = async (req: any, res: any) => {
  try {
    const sectionId = req.params.sectionId;
    const lessons = await LessonService.getLessonsBySectionId(sectionId);
    res.status(200).json({ success: true, data: lessons });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};
export const getLessonById = async (req: any, res: any) => {
  try {
    const lessonId = req.params.lessonId;
    const lesson = await LessonService.getLessonById(lessonId);
    if (!lesson) {
      return res
        .status(404)
        .json({ success: false, message: "Lesson not found" });
    }
    res.status(200).json({ success: true, data: lesson });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const createLesson = async (req: any, res: any) => {
  try {
    const data = req.body;
    const newLesson = await LessonService.createLesson(data);
    res.status(201).json({ success: true, data: newLesson });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};
export const updateLesson = async (req: any, res: any) => {
  try {
    const lessonId = req.params.lessonId;
    const data = req.body;
    const updatedLesson = await LessonService.updateLesson(lessonId, data);
    if (!updatedLesson) {
      return res
        .status(404)
        .json({ success: false, message: "Lesson not found" });
    }
    res.status(200).json({ success: true, data: updatedLesson });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};
export const deleteLesson = async (req: any, res: any) => {
  try {
    const lessonId = req.params.lessonId;
    const deletedLesson = await LessonService.deleteLesson(lessonId);
    if (!deletedLesson) {
      return res
        .status(404)
        .json({ success: false, message: "Lesson not found" });
    }
    res.status(200).json({ success: true, data: deletedLesson });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Reorder lessons in section
export const reorderLessons = async (req: any, res: any) => {
  try {
    const sectionId = req.params.sectionId;
    const { lessonIds } = req.body; // Array of lesson IDs in new order

    if (!Array.isArray(lessonIds) || lessonIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "lessonIds must be a non-empty array",
      });
    }

    const updatedLessons = await LessonService.reorderLessons(
      sectionId,
      lessonIds
    );
    res.status(200).json({
      success: true,
      data: updatedLessons,
      message: "Lessons reordered successfully",
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// TODO: Upload video endpoint
// export const uploadVideo = async (req: any, res: any) => {
//   try {
//     // Multer middleware will handle file upload
//     const file = req.file;
//
//     if (!file) {
//       return res.status(400).json({
//         success: false,
//         message: "No video file provided"
//       });
//     }
//
//     // Upload to cloud storage (Cloudinary/AWS S3)
//     const videoData = await LessonService.uploadVideo(file);
//
//     res.status(200).json({
//       success: true,
//       data: videoData,
//       message: "Video uploaded successfully"
//     });
//   } catch (error: any) {
//     res.status(400).json({ success: false, message: error.message });
//   }
// };
