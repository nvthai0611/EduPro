import { Request, Response } from "express";
import categoryService from "./category.service";

class CategoryController {
  async getAll(req: Request, res: Response) {
    const categories = await categoryService.getAll();
    res.json({
      message: "Lấy danh sách category thành công",
      data: categories
    });
  }

  async getById(req: Request, res: Response) {
    const category = await categoryService.getById(req.params.id);
    if (!category)
      return res.status(404).json({ message: "Không tìm thấy category" });

    res.json({ data: category });
  }

  async getBySlug(req: Request, res: Response) {
    const category = await categoryService.getBySlug(req.params.slug);
    if (!category)
      return res.status(404).json({ message: "Không tìm thấy category" });

    res.json({ data: category });
  }

  async create(req: Request, res: Response) {
    const newCategory = await categoryService.createCategory(req.body);
    res.status(201).json({
      message: "Tạo category thành công",
      data: newCategory
    });
  }

  async update(req: Request, res: Response) {
    const updated = await categoryService.updateCategory(req.params.id, req.body);
    if (!updated)
      return res.status(404).json({ message: "Không tìm thấy category" });

    res.json({ message: "Cập nhật thành công", data: updated });
  }

  async delete(req: Request, res: Response) {
    const deleted = await categoryService.deleteCategory(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Không tìm thấy category" });

    res.json({ message: "Xóa category thành công" });
  }
}

export default new CategoryController();
