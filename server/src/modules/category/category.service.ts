import categoryRepository from "./category.repository";
import { ICategory } from "./category.model";

class CategoryService {
  async getAll(): Promise<ICategory[]> {
    return categoryRepository.findAll();
  }

  async getById(id: string): Promise<ICategory | null> {
    return categoryRepository.findById(id);
  }

  async getBySlug(slug: string): Promise<ICategory | null> {
    return categoryRepository.findBySlug(slug);
  }

  async createCategory(data: Partial<ICategory>): Promise<ICategory> {
    return categoryRepository.create(data);
  }

  async updateCategory(id: string, data: Partial<ICategory>): Promise<ICategory | null> {
    return categoryRepository.update(id, data);
  }

  async deleteCategory(id: string): Promise<ICategory | null> {
    return categoryRepository.delete(id);
  }
}

export default new CategoryService();
