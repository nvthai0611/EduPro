import Forum from "./forum.model";

class forumRepository {
  // Repository methods here
  async findAllForums(query: any = {}, options: any = {}): Promise<any[]> {
    // Implementation to find all forums
    const queryBuilder = Forum.find(query);

    // Apply select if provided
    if (options.select) {
      queryBuilder.select(options.select);
    }
    
    // Apply populate if provided
    if (options.populate) {
      queryBuilder.populate(options.populate);
      // Don't use lean() when populating
      return queryBuilder.sort({ createdAt: -1 });
    }
    
    return queryBuilder.sort({ createdAt: -1 }).lean();
  }
  async findForumById(id: string) {
    // Implementation to find a forum by ID
    return Forum.findById(id).lean();
  }
  async findForumsByUser(userId: string) {
    // Implementation to find forums by user ID
    return Forum.find({ authorId: userId }).lean();
  }
  async findForumsByCategory(categoryId: string) {
    // Implementation to find forums by category ID
    return Forum.find({ categoryId }).lean();
  }
  async findForumsByTag(tag: string) {
    // Implementation to find forums by tag
    return Forum.find({ tags: tag }).lean();
  }
  async findForumBySlug(slug: string) {
    // Implementation to find a forum by slug
    return Forum.findOne({ slug }).lean();
  }
  async createForum(data: any) {
    // Implementation to create a new forum
    return Forum.create(data);
  }
  async deleteForum(id: string) {
    // Implementation to delete a forum by ID
    return Forum.findByIdAndDelete(id);
  }
  async updateForum(id: string, data: any) {
    // Implementation to update a forum by ID
    return Forum.findByIdAndUpdate(
      id,
      { ...data, updatedAt: new Date() },
      { new: true }
    );
  }
}

export const ForumRepository = new forumRepository();
