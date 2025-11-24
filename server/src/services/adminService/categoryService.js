const Category = require('../../models/category.model');
const { deleteImagesFromCloudinary } = require('../../utils/cloudinaryUtils');

class CategoryServiceService {
    async createCategory(categoryData) {
        if (!categoryData.name || !categoryData.name.trim()) {
            throw new Error('Tên danh mục không được để trống');
        }
        if (!categoryData.description || !categoryData.description.trim()) {
            throw new Error('Mô tả danh mục không được để trống');
        }
        if (!categoryData.image) {
            throw new Error('Hình ảnh danh mục không được để trống');
        }
        const existed = await Category.findOne({ name: categoryData.name });
        if (existed) {
            throw new Error('Tên danh mục đã tồn tại');
        }
        const category = new Category(categoryData);
        return await category.save();
    }
    async updateCategory (categoryId, categoryData, fileImage) {
        try {
            let imageUrl = "";
    
            // Kiểm tra tồn tại
            const checkCategory = await Category.findById(categoryId);
            if (!checkCategory) {
                throw new Error("Category not found");
            }
    
            // Nếu có ảnh mới
            if (fileImage && fileImage.path) {
                imageUrl = fileImage.path;
                categoryData.image = imageUrl;
    
                // Xoá ảnh cũ từ Cloudinary
                if (checkCategory.image) {
                    await deleteImagesFromCloudinary(checkCategory.image);
                }
            }
            // Nếu không có file mới, nhưng có image là string (URL cũ), giữ nguyên
            // (Không cần làm gì thêm, categoryData.image đã là string)
    
            // Cập nhật
            const updatedCategory = await Category.findByIdAndUpdate(categoryId, categoryData, { new: true });
            return updatedCategory;
        } catch (error) {
            console.error("Error updating category:", error);
            throw error;
        }
    };
    async getAllCategories() {
        return await Category.find();
    }

    async getCategoryById(id) {
        return await Category.findById(id);
    }



    async deleteCategory(id) {
        return await Category.findByIdAndDelete(id);
    }
}

module.exports = new CategoryServiceService();