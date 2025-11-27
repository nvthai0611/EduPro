import Category, { ICategory } from "./category.model";

class CategoryRepository {
  async findAll(): Promise<ICategory[]> {
    return Category.find().sort({ order: 1 });
  }

  async findById(id: string): Promise<ICategory | null> {
    return Category.findById(id);
  }

  async findBySlug(slug: string): Promise<ICategory | null> {
    return Category.findOne({ slug });
  }

  async create(data: Partial<ICategory>): Promise<ICategory> {
    return Category.create(data);
  }

  async update(id: string, data: Partial<ICategory>): Promise<ICategory | null> {
    return Category.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<ICategory | null> {
    return Category.findByIdAndDelete(id);
  }
}

export default new CategoryRepository();
