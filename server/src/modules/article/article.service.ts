import LessonRepository from "../lesson/lesson.repository";
import SectionRepository from "../section/section.repository";
import OrderService from "../order/order.service";
import {
  CreateArticleLessonPayload,
  UpdateArticleLessonPayload,
} from "./article.validator";

const HTML_TAG_REGEX = /<[^>]+>/g;

class ArticleLessonService {
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

    const lastOrder = await LessonRepository.getMaxOrderInSection(sectionId);
    return lastOrder + 1;
  }

  async createArticleLesson(payload: CreateArticleLessonPayload) {
    await this.validateSectionAndCourse({
      sectionId: payload.sectionId,
      courseId: payload.courseId,
    });

    const order = await this.resolveOrder(payload.sectionId, payload.order);
    const readingTime =
      payload.readingTime ?? this.calculateReadingTime(payload.content);

    const articleLesson = await LessonRepository.createLesson({
      ...payload,
      order,
      readingTime,
      type: "article",
      isDeleted: false,
    });

    return articleLesson;
  }

  async updateArticleLesson(
    lessonId: string,
    payload: UpdateArticleLessonPayload
  ) {
    const existingLesson = await LessonRepository.findLessonById(lessonId);

    if (!existingLesson || existingLesson.type !== "article") {
      throw new Error("Không tìm thấy bài học dạng article");
    }

    const updatePayload: Record<string, unknown> = {
      ...payload,
    };

    if (payload.content && !payload.readingTime) {
      updatePayload.readingTime = this.calculateReadingTime(payload.content);
    }

    const updated = await LessonRepository.updateLesson(lessonId, {
      ...updatePayload,
      type: "article",
    });

    if (!updated) {
      throw new Error("Cập nhật bài học thất bại");
    }

    return updated;
  }

  async getArticleLessonById(lessonId: string) {
    const existingLesson = await LessonRepository.findLessonById(lessonId);

    if (!existingLesson || existingLesson.type !== "article") {
      throw new Error("Không tìm thấy bài học dạng article");
    }

    return existingLesson;
  }

  async getPublishedArticleContent(
    lessonId: string,
    context?: { userId?: string; role?: string }
  ) {
    const article = await LessonRepository.findPublishedArticleById(lessonId);

    if (!article) {
      throw new Error("Bài học chưa được xuất bản hoặc không tồn tại");
    }

    if (!article.isFree && !article.isPreviewed) {
      if (context?.role && ["admin", "instructor"].includes(context.role)) {
        return article;
      }

      if (!context?.userId) {
        throw new Error("Yêu cầu xác thực để truy cập bài học này");
      }

      if (!article.courseId) {
        throw new Error("Bài học không liên kết khóa học hợp lệ");
      }

      const hasPurchased = await OrderService.checkUserPurchased(
        context.userId,
        article.courseId.toString()
      );

      if (!hasPurchased) {
        throw new Error("Bạn không có quyền truy cập bài học này");
      }
    }

    return article;
  }

  async getArticlesBySection(sectionId: string) {
    const section = await SectionRepository.getSectionById(sectionId);

    if (!section || section.isDeleted) {
      throw new Error("Section không tồn tại hoặc đã bị xóa");
    }

    return LessonRepository.findArticlesBySection(sectionId);
  }
}

export default new ArticleLessonService();
