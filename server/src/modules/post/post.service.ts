import { PostRepository } from "./post.repository";


class postService {
  // Service methods here
  async getAllPosts(query: any = {}, options: any = {}): Promise<any> {
    return PostRepository.findAllPosts(query, options);
  }
  async getTrendingPosts(
    limit: number,
    timeRange: number,
    page: number = 1
  ): Promise<any> {
    const dateThreshold = new Date();
    dateThreshold.setDate(dateThreshold.getDate() - timeRange);

    return await PostRepository.findTrendingPosts(dateThreshold, page, limit);
  }

  async getFeaturedPosts(limit: number, page: number = 1): Promise<any> {
    return await PostRepository.findFeaturedPosts(page, limit);
  }

  async getPostById(id: string): Promise<any> {
    return PostRepository.findPostById(id);
  }
  async getPostsByUser(userId: string): Promise<any[]> {
    return PostRepository.findPostsByUser(userId);
  }
  async getPostsByCategory(categoryId: string): Promise<any[]> {
    return PostRepository.findPostsByCategory(categoryId);
  }
  async getPostsByTag(tag: string): Promise<any[]> {
    return PostRepository.findPostsByTag(tag);
  }
  async getPostBySlug(slug: string): Promise<any> {
    return PostRepository.findPostBySlug(slug);
  }
  async createPost(data: any): Promise<any> {
    return PostRepository.createPost(data);
  }
  async deletePost(id: string): Promise<any> {
    return PostRepository.deletePost(id);
  }
  async updatePost(id: string, data: any): Promise<any> {
    return PostRepository.updatePost(id, data);
  }

  // Post reaction
  async findUserReactions(userId: string, postId: string): Promise<any[]> {
    return PostRepository.findUserReactions(userId, postId);
  }
  async createPostReaction(data: any): Promise<any> {
    return PostRepository.createPostReaction(data);
  }
  async deletePostReaction(id: string): Promise<any> {
    return PostRepository.deletePostReaction(id);
  }
  async deleteUserReaction(userId: string, postId: string, type: string): Promise<any> {
    return PostRepository.deleteUserReaction(userId, postId, type);
  }

  // Post view tracking
  async trackView(postId: string, viewerId: string): Promise<{ success: boolean; isNewView: boolean; message?: string }> {
    try {
      // Try to create a new view record
      const view = await PostRepository.createPostView(postId, viewerId);
      
      if (view) {
        // New view - increment the counter
        await PostRepository.incrementViewCount(postId);
        return { success: true, isNewView: true };
      } else {
        // View already exists (duplicate)
        return { success: true, isNewView: false, message: "Already viewed" };
      }
    } catch (error: any) {
      console.error("❌ trackView error:", error);
      throw error;
    }
  }
}

export const PostService = new postService();