import { ForumRepository } from "./forum.repository";


class forumService {
  // Service methods here
  async getAllForums(query: any = {}, options: any = {}): Promise<any[]> {
    return ForumRepository.findAllForums(query, options);
  }
  async getForumById(id: string): Promise<any> {
    return ForumRepository.findForumById(id);
  }
  async getForumsByUser(userId: string): Promise<any[]> {
    return ForumRepository.findForumsByUser(userId);
  }
  async getForumsByCategory(categoryId: string): Promise<any[]> {
    return ForumRepository.findForumsByCategory(categoryId);
  }
  async getForumsByTag(tag: string): Promise<any[]> {
    return ForumRepository.findForumsByTag(tag);
  }
  async getForumBySlug(slug: string): Promise<any> {
    return ForumRepository.findForumBySlug(slug);
  }
  async createForum(data: any): Promise<any> {
    return ForumRepository.createForum(data);
  }
  async deleteForum(id: string): Promise<any> {
    return ForumRepository.deleteForum(id);
  }
  async updateForum(id: string, data: any): Promise<any> {
    return ForumRepository.updateForum(id, data);
  }
}

export const ForumService = new forumService();