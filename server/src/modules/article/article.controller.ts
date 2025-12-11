import { Request, Response } from "express";
import { ValidationError } from "yup";
import ArticleLessonService from "./article.service";
import {
  createArticleLessonSchema,
  updateArticleLessonSchema,
} from "./article.validator";

const parseValidationError = (error: ValidationError) => {
  return error.inner.length > 0
    ? error.inner.map((issue) => ({
        path: issue.path,
        message: issue.message,
      }))
    : [
        {
          path: error.path,
          message: error.message,
        },
      ];
};

export const createArticleLesson = async (req: Request, res: Response) => {
  try {
    const payload = await createArticleLessonSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    const article = await ArticleLessonService.createArticleLesson(payload);

    return res.status(201).json({
      success: true,
      data: article,
      message: "Tạo bài viết thành công",
    });
  } catch (error: any) {
    if (error instanceof ValidationError) {
      return res.status(422).json({
        success: false,
        message: "Dữ liệu không hợp lệ",
        errors: parseValidationError(error),
      });
    }

    return res.status(400).json({
      success: false,
      message: error?.message ?? "Không thể tạo bài viết",
    });
  }
};

export const updateArticleLesson = async (req: Request, res: Response) => {
  try {
    const payload = await updateArticleLessonSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    const { lessonId } = req.params;
    const article = await ArticleLessonService.updateArticleLesson(
      lessonId,
      payload
    );

    return res.status(200).json({
      success: true,
      data: article,
      message: "Cập nhật bài viết thành công",
    });
  } catch (error: any) {
    if (error instanceof ValidationError) {
      return res.status(422).json({
        success: false,
        message: "Dữ liệu không hợp lệ",
        errors: parseValidationError(error),
      });
    }

    return res.status(400).json({
      success: false,
      message: error?.message ?? "Không thể cập nhật bài viết",
    });
  }
};

export const getArticleLesson = async (req: Request, res: Response) => {
  try {
    const { lessonId } = req.params;
    const article = await ArticleLessonService.getArticleLessonById(lessonId);

    return res.status(200).json({
      success: true,
      data: article,
    });
  } catch (error: any) {
    return res.status(404).json({
      success: false,
      message: error?.message ?? "Không tìm thấy bài viết",
    });
  }
};

export const getArticleContent = async (req: Request, res: Response) => {
  try {
    const { lessonId } = req.params;
    const user = (req as any).user;

    const article = await ArticleLessonService.getPublishedArticleContent(
      lessonId,
      {
        userId: user?.userId,
        role: user?.role,
      }
    );

    return res.status(200).json({
      success: true,
      data: article,
    });
  } catch (error: any) {
    return res.status(404).json({
      success: false,
      message: error?.message ?? "Không tìm thấy bài viết",
    });
  }
};

export const getArticlesBySection = async (req: Request, res: Response) => {
  try {
    const { sectionId } = req.params;
    const articles = await ArticleLessonService.getArticlesBySection(sectionId);

    return res.status(200).json({
      success: true,
      data: articles,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error?.message ?? "Không thể lấy danh sách bài viết",
    });
  }
};
