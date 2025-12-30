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
    // console.log("🔍 [ArticleService] Creating article with payload:", payload);
    
    await this.validateSectionAndCourse({
      sectionId: payload.sectionId,
      courseId: payload.courseId,
    });

    const order = await this.resolveOrder(payload.sectionId, payload.order);
    const readingTime =
      payload.readingTime ?? this.calculateReadingTime(payload.content);

    const articleData = {
      ...payload,
      sectionId: new mongoose.Types.ObjectId(payload.sectionId),
      courseId: new mongoose.Types.ObjectId(payload.courseId),
      order,
      readingTime,
      isDeleted: false,
    };

    // console.log("🔍 [ArticleService] Article data to save:", articleData);

    const article = await ArticleRepository.createArticle(articleData);

    // console.log("🔍 [ArticleService] Article saved successfully:", article);

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
    // console.log('🔍 Getting article content for ID:', articleId);
    // console.log('👤 User context:', context);
    
    // Nếu là admin/instructor, cho phép xem mọi article
    if (context?.role && ["admin", "instructor"].includes(context.role)) {
      const article = await ArticleRepository.findArticleById(articleId);
      if (!article) {
        // console.log('❌ Article not found (admin):', articleId);
        throw new Error("Bài viết không tồn tại");
      }
      // console.log('✅ Article found for admin/instructor:', article.title);
      return article;
    }

    // Với user thường, thử lấy published article trước
    let article = await ArticleRepository.findPublishedArticleById(articleId);

    // Nếu không có published article, kiểm tra xem có article chưa publish không
    if (!article) {
      // console.log('⚠️ Published article not found, checking unpublished...');
      article = await ArticleRepository.findArticleById(articleId);
      
      if (!article) {
        // console.log('❌ Article does not exist:', articleId);
        throw new Error("Bài viết không tồn tại");
      }
      
      // console.log('📝 Found unpublished article:', article.title, {
        //isPublished: article.isPublished,
        //isDeleted: article.isDeleted
      // });
      
      // Article chưa publish - check quyền truy cập qua purchase
      if (!context?.userId) {
        throw new Error("Yêu cầu xác thực để truy cập bài viết này");
      }
      
      if (!article.courseId) {
        throw new Error("Bài viết không liên kết khóa học hợp lệ");
      }
      
      // Check xem user đã mua khóa học chưa
      // Handle both populated and non-populated courseId
      const courseIdString = article.courseId?._id 
        ? article.courseId._id.toString()  // Populated - extract _id
        : article.courseId?.toString();     // Non-populated - use directly
      
      // console.log('🔍 Checking if user purchased course:', {
      //   userId: context.userId,
      //   courseId: courseIdString,
      //   courseIdType: typeof article.courseId,
      //   hasIdProperty: !!article.courseId?._id
      // });
      
      const hasPurchased = await OrderService.checkUserPurchased(
        context.userId,
        courseIdString
      );
      
      // console.log('💰 Purchase check result:', hasPurchased);
      
      if (!hasPurchased) {
        // console.log('❌ User has not purchased course:', context.userId, courseIdString);
        throw new Error("Bạn cần mua khóa học để truy cập bài viết này");
      }
      
      // console.log('✅ User purchased course, allowing access to unpublished article');
      return article;
    }

    // console.log('✅ Published article found:', article.title);
    if (!article.isFree && !article.isPreviewed) {
      if (context?.role && ["admin", "instructor"].includes(context.role)) {
        return article;
      }

      if (!context?.userId) {
        throw new Error("Yêu cầu xác thực để truy cập bài viết này");
      }

      // if (!article.courseId) {
      //   throw new Error("Bài viết không liên kết khóa học hợp lệ");
      // }

      // Handle both populated and non-populated courseId
      const courseIdString = article.courseId?._id 
        ? article.courseId._id.toString()  // Populated - extract _id
        : article.courseId?.toString();     // Non-populated - use directly

      const hasPurchased = await OrderService.checkUserPurchased(
        context.userId,
        courseIdString
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
