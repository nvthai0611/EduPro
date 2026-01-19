import PostReactions from "./models/post-reactions.model";
import Posts from "./models/post.model";

class postRepository {
  // Repository methods here
  async findAllPosts(query: any = {}, options: any = {}): Promise<any[]> {
    // Implementation to find all posts
    const queryBuilder = Posts.find(query);

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
  async findPostById(id: string) {
    // Implementation to find a post by ID
    return Posts.findById(id).lean();
  }
  async findPostsByUser(userId: string) {
    // Implementation to find posts by user ID
    return Posts.find({ authorId: userId }).lean();
  }
  async findPostsByCategory(categoryId: string) {
    // Implementation to find posts by category ID
    return Posts.find({ categoryId }).lean();
  }
  async findPostsByTag(tag: string) {
    // Implementation to find posts by tag
    return Posts.find({ tags: tag }).lean();
  }
  async findPostBySlug(slug: string) {
    // Implementation to find a post by slug
    return Posts.findOne({ slug }).lean();
  }
  async createPost(data: any) {
    // Implementation to create a new post
    return Posts.create(data);
  }
  async deletePost(id: string) {
    // Implementation to delete a post by ID
    return Posts.findByIdAndDelete(id);
  }
  async updatePost(id: string, data: any) {
    // Implementation to update a post by ID
    return Posts.findByIdAndUpdate(
      id,
      { ...data, updatedAt: new Date() },
      { new: true }
    );
  }




  // Post reaction
  async findUserReactions(userId: string, postId: string) {
    return PostReactions.find({ userId, postId }).lean();
  }

  async createPostReaction(data: any) {
    // Implementation to create a new post reaction
    const reaction = await PostReactions.create(data);
    
    // Update count in Post
    const countField = data.type === "LIKE" ? "likesCount" : "savesCount";
    await Posts.findByIdAndUpdate(data.postId, { $inc: { [countField]: 1 } });
    
    return reaction;
  }

  async deletePostReaction(id: string) {
    // Implementation to delete a post reaction by ID
    const reaction = await PostReactions.findByIdAndDelete(id);
    if (reaction) {
      // Update count in Post
      const countField = reaction.type === "LIKE" ? "likesCount" : "savesCount";
      await Posts.findByIdAndUpdate(reaction.postId, { $inc: { [countField]: -1 } });
    }
    return reaction;
  }

  async deleteUserReaction(userId: string, postId: string, type: string) {
    const reaction = await PostReactions.findOneAndDelete({ userId, postId, type });
    if (reaction) {
      const countField = type === "LIKE" ? "likesCount" : "savesCount";
      await Posts.findByIdAndUpdate(postId, { $inc: { [countField]: -1 } });
    }
    return reaction;
  }
}

export const PostRepository = new postRepository();