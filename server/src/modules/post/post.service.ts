import { PostRepository } from "./post.repository";


class postService {
  // Service methods here
  async getAllPosts(query: any = {}, options: any = {}): Promise<any[]> {
    return PostRepository.findAllPosts(query, options);
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
}

export const PostService = new postService();