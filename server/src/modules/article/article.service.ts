import ArticleRepository from "./article.repository";
import SectionRepository from "../section/section.repository";
import OrderService from "../order/order.service";
import mongoose from "mongoose";
import {
  CreateArticleLessonPayload,
  UpdateArticleLessonPayload,
} from "./article.validator";

const HTML_TAG_REGEX = /<[^>]+>/g;

class ArticleService {
  private calculateReadingTime(content: string): number {
    const plainText = content.replace(HTML_TAG_REGEX, " ");
    const words = plainText
      .split(/\s+/)
      .map((token) => token.trim())
      .filter(Boolean);

    const estimatedMinutes = Math.ceil(words.length / 200) || 1;
    return Math.max(1, estimatedMinutes);
  }

  private async validateSectionAndCourse({
    sectionId,
    courseId,
  }: {
    sectionId: string;
    courseId: string;
  }) {
    const section = await SectionRepository.getSectionById(sectionId);

    if (!section || section.isDeleted) {
      throw new Error("Section không tồn tại hoặc đã bị xóa");
    }

    if (section.courseId?.toString() !== courseId) {
      throw new Error("Section không thuộc về khóa học được cung cấp");
    }

    return section;
  }

  private async resolveOrder(sectionId: string, requestedOrder?: number) {
    if (requestedOrder && requestedOrder > 0) {
      return requestedOrder;
    }

    const lastOrder = await ArticleRepository.getMaxOrderInSection(sectionId);
    return lastOrder + 1;
  }

  async createArticle(payload: CreateArticleLessonPayload) {
    console.log("🔍 [ArticleService] Creating article with payload:", payload);
    
    await this.validateSectionAndCourse({
      sectionId: payload.sectionId,
      courseId: payload.courseId,
    });

    const order = await this.resolveOrder(payload.sectionId, payload.order);
    const readingTime =
      payload.readingTime ?? this.calculateReadingTime(payload.content);

    console.log("🔍 [ArticleService] Calculated order:", order, "readingTime:", readingTime);

    const articleData = {
      ...payload,
      sectionId: new mongoose.Types.ObjectId(payload.sectionId),
      courseId: new mongoose.Types.ObjectId(payload.courseId),
      order,
      readingTime,
      isDeleted: false,
    };

    console.log("🔍 [ArticleService] Article data to save:", articleData);

    const article = await ArticleRepository.createArticle(articleData);

    console.log("🔍 [ArticleService] Article saved successfully:", article);

    return article;
  }

  async updateArticle(
    articleId: string,
    payload: UpdateArticleLessonPayload
  ) {
    const existingArticle = await ArticleRepository.findArticleById(articleId);

    if (!existingArticle) {
      throw new Error("Không tìm thấy bài viết");
    }

    const updatePayload: Record<string, unknown> = {
      ...payload,
    };

    if (payload.content && !payload.readingTime) {
      updatePayload.readingTime = this.calculateReadingTime(payload.content);
    }

    const updated = await ArticleRepository.updateArticle(articleId, updatePayload);

    if (!updated) {
      throw new Error("Cập nhật bài viết thất bại");
    }

    return updated;
  }

  async getArticleById(articleId: string) {
    const article = await ArticleRepository.findArticleById(articleId);

    if (!article) {
      throw new Error("Không tìm thấy bài viết");
    }

    return article;
  }

  async getPublishedArticleContent(
    articleId: string,
    context?: { userId?: string; role?: string }
  ) {
    const article = await ArticleRepository.findPublishedArticleById(articleId);

    if (!article) {
      throw new Error("Bài viết chưa được xuất bản hoặc không tồn tại");
    }

    if (!article.isFree && !article.isPreviewed) {
      if (context?.role && ["admin", "instructor"].includes(context.role)) {
        return article;
      }

      if (!context?.userId) {
        throw new Error("Yêu cầu xác thực để truy cập bài viết này");
      }

      if (!article.courseId) {
        throw new Error("Bài viết không liên kết khóa học hợp lệ");
      }

      const hasPurchased = await OrderService.checkUserPurchased(
        context.userId,
        article.courseId.toString()
      );

      if (!hasPurchased) {
        throw new Error("Bạn không có quyền truy cập bài viết này");
      }
    }

    return article;
  }

  async getArticlesBySection(sectionId: string) {
    const section = await SectionRepository.getSectionById(sectionId);

    if (!section || section.isDeleted) {
      throw new Error("Section không tồn tại hoặc đã bị xóa");
    }

    return ArticleRepository.findArticlesBySection(sectionId);
  }

  async deleteArticle(articleId: string) {
    const existingArticle = await ArticleRepository.findArticleById(articleId);

    if (!existingArticle) {
      throw new Error("Không tìm thấy bài viết");
    }

    return await ArticleRepository.deleteArticle(articleId);
  }

  async reorderArticles(sectionId: string, articleIds: string[]) {
    // Validate section exists
    const section = await SectionRepository.getSectionById(sectionId);
    if (!section || section.isDeleted) {
      throw new Error("Section không tồn tại hoặc đã bị xóa");
    }

    // Create update operations
    const articleUpdates = articleIds.map((id, index) => ({
      id,
      order: index + 1,
    }));

    return await ArticleRepository.reorderArticles(articleUpdates);
  }

  async searchArticles(query: string, courseId?: string) {
    return await ArticleRepository.searchArticles(query, courseId);
  }
}

export default new ArticleService();
