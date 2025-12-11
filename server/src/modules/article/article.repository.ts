import Article, { IArticle } from "./article.model";
import mongoose from "mongoose";

class ArticleRepository {
  // Create new article
  async createArticle(articleData: Partial<IArticle>) {
    // console.log("🔍 [ArticleRepository] Creating article with data:", articleData);
    
    const article = new Article(articleData);
    // console.log("🔍 [ArticleRepository] Created article instance:", article);
    
    const savedArticle = await article.save();
    // console.log("🔍 [ArticleRepository] Article saved to DB:", savedArticle);
    
    return savedArticle;
  }

  // Get article by ID
  async findArticleById(articleId: string) {
    return await Article.findOne({
      _id: articleId,
      isDeleted: false,
    }).populate("sectionId courseId");
  }

  // Get published article by ID
  async findPublishedArticleById(articleId: string) {
    return await Article.findOne({
      _id: articleId,
      isPublished: true,
      isDeleted: false,
    }).populate("sectionId courseId");
  }

  // Get articles by section
  async findArticlesBySection(sectionId: string) {
    return await Article.find({
      sectionId: new mongoose.Types.ObjectId(sectionId),
      isDeleted: false,
    })
      .sort({ order: 1 })
      .populate("sectionId courseId");
  }

  // Get articles by course
  async findArticlesByCourse(courseId: string) {
    return await Article.find({
      courseId: new mongoose.Types.ObjectId(courseId),
      isDeleted: false,
    })
      .sort({ order: 1 })
      .populate("sectionId courseId");
  }

  // Update article
  async updateArticle(articleId: string, updateData: Partial<IArticle>) {
    return await Article.findByIdAndUpdate(
      articleId,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
  }

  // Soft delete article
  async deleteArticle(articleId: string) {
    return await Article.findByIdAndUpdate(
      articleId,
      { isDeleted: true, updatedAt: new Date() },
      { new: true }
    );
  }

  // Get max order in section
  async getMaxOrderInSection(sectionId: string): Promise<number> {
    const result = await Article.findOne({
      sectionId: new mongoose.Types.ObjectId(sectionId),
      isDeleted: false,
    })
      .sort({ order: -1 })
      .select("order");

    return result?.order || 0;
  }

  // Reorder articles in section
  async reorderArticles(articleUpdates: Array<{ id: string; order: number }>) {
    const bulkOps = articleUpdates.map(({ id, order }) => ({
      updateOne: {
        filter: { _id: id },
        update: { order, updatedAt: new Date() },
      },
    }));

    return await Article.bulkWrite(bulkOps);
  }

  // Count articles by section
  async countArticlesBySection(sectionId: string): Promise<number> {
    return await Article.countDocuments({
      sectionId: new mongoose.Types.ObjectId(sectionId),
      isDeleted: false,
    });
  }

  // Count articles by course
  async countArticlesByCourse(courseId: string): Promise<number> {
    return await Article.countDocuments({
      courseId: new mongoose.Types.ObjectId(courseId),
      isDeleted: false,
    });
  }

  // Check if article exists
  async articleExists(articleId: string): Promise<boolean> {
    const article = await Article.findOne({
      _id: articleId,
      isDeleted: false,
    });
    return !!article;
  }

  // Get published articles by section
  async findPublishedArticlesBySection(sectionId: string) {
    return await Article.find({
      sectionId: new mongoose.Types.ObjectId(sectionId),
      isPublished: true,
      isDeleted: false,
    })
      .sort({ order: 1 })
      .populate("sectionId courseId");
  }

  // Search articles
  async searchArticles(query: string, courseId?: string) {
    const filter: any = {
      isDeleted: false,
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { content: { $regex: query, $options: "i" } },
      ],
    };

    if (courseId) {
      filter.courseId = new mongoose.Types.ObjectId(courseId);
    }

    return await Article.find(filter)
      .sort({ updatedAt: -1 })
      .populate("sectionId courseId");
  }
}

export default new ArticleRepository();