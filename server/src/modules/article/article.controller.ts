import { Request, Response } from "express";
import { ValidationError } from "yup";
import ArticleService from "./article.service";
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

    const article = await ArticleService.createArticle(payload);

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
    const article = await ArticleService.updateArticle(lessonId, payload);

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
    const article = await ArticleService.getArticleById(lessonId);

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

export const deleteArticleLesson = async (req: Request, res: Response) => {
  try {
    const { lessonId } = req.params;
    await ArticleService.deleteArticle(lessonId);

    return res.status(200).json({
      success: true,
      message: "Xóa bài viết thành công",
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error?.message ?? "Không thể xóa bài viết",
    });
  }
};

export const getArticlesBySection = async (req: Request, res: Response) => {
  try {
    const { sectionId } = req.params;
    const articles = await ArticleService.getArticlesBySection(sectionId);

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

export const getArticleContent = async (req: Request, res: Response) => {
  try {
    const { articleId } = req.params;
    const user = (req as any).user;
    
    if (!articleId) {
      return res.status(400).json({
        success: false,
        message: "Article ID is required",
      });
    }
    
    const context = {
      userId: user?.userId,
      role: user?.role,
    };

    const article = await ArticleService.getPublishedArticleContent(articleId, context);

    return res.status(200).json({
      success: true,
      data: article,
    });
  } catch (error: any) {
    const statusCode = error?.message?.includes("Yêu cầu xác thực") ? 401 :
                      error?.message?.includes("không có quyền") ? 403 : 404;

    return res.status(statusCode).json({
      success: false,
      message: error?.message ?? "Không thể truy cập bài viết",
    });
  }
};

export const reorderArticles = async (req: Request, res: Response) => {
  try {
    const { sectionId } = req.params;
    const { articleIds } = req.body;

    if (!Array.isArray(articleIds)) {
      return res.status(400).json({
        success: false,
        message: "articleIds phải là một mảng",
      });
    }

    await ArticleService.reorderArticles(sectionId, articleIds);

    return res.status(200).json({
      success: true,
      message: "Sắp xếp lại bài viết thành công",
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error?.message ?? "Không thể sắp xếp lại bài viết",
    });
  }
};

export const searchArticles = async (req: Request, res: Response) => {
  try {
    const { query, courseId } = req.query;

    if (!query || typeof query !== "string") {
      return res.status(400).json({
        success: false,
        message: "Query tìm kiếm là bắt buộc",
      });
    }

    const articles = await ArticleService.searchArticles(
      query,
      courseId as string
    );

    return res.status(200).json({
      success: true,
      data: articles,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error?.message ?? "Không thể tìm kiếm bài viết",
    });
  }
};
