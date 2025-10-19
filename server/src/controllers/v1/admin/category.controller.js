const categoryService = require('../../../services/adminService/categoryService');
const { successResponse, errorResponse } = require('../../../utils/response');

exports.createCategory = async (req, res) => {
    try {
        const categoryData = {
            ...req.body
        };

        // If image is uploaded through file
        if (req.file) {
            categoryData.image = req.file.path;
        }
        // If image URL is provided in request body
        else if (req.body.image) {
            categoryData.image = req.body.image;
        }
        // If no image is provided
        else {
            return errorResponse(res, {}, 400, 'Vui lòng tải lên hình ảnh danh mục');
        }

        const category = await categoryService.createCategory(categoryData);
        return successResponse(res, category, {}, 201, 'Tạo danh mục mới thành công');
    } catch (error) {
        return errorResponse(res, {}, 400, error.message || 'Lỗi khi tạo danh mục mới');
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const {
            name,
            description,
            image
        } = req.body;

        const categoryData = {
            name,
            description,
            image
        };

        // Lấy file ảnh từ request
        const fileImage = req.file;
        // Nếu không có file, nhưng có image là string (URL cũ), vẫn cho phép update
        if (!fileImage && (!image || typeof image !== 'string')) {
            return errorResponse(res, {}, 400, "Image file is required");
        }

        const updatedCategory = await categoryService.updateCategory(categoryId, categoryData, fileImage);

        return successResponse(res, updatedCategory, "Update category successfully", 200);
    } catch (error) {
        console.error("Error updating category:", error);
        return errorResponse(res, {}, error.status || 500, `${error.message}`);
    }
};

exports.getAllCategories = async (req, res) => {
    try {
        const categories = await categoryService.getAllCategories();
        return successResponse(res, categories, {}, 200, 'Lấy danh sách danh mục thành công');
    } catch (error) {
        return errorResponse(res, {}, 500, 'Lỗi khi lấy danh sách danh mục');
    }
};

exports.getCategory = async (req, res) => {
    try {
        const category = await categoryService.getCategoryById(req.params.id);
        if (!category) {
            return errorResponse(res, {}, 404, 'Không tìm thấy danh mục');
        }
        return successResponse(res, category, {}, 200, 'Lấy thông tin danh mục thành công');
    } catch (error) {
        return errorResponse(res, {}, 500, 'Lỗi khi lấy thông tin danh mục');
    }
};


exports.deleteCategory = async (req, res) => {
    try {
        const category = await categoryService.deleteCategory(req.params.id);
        if (!category) {
            return errorResponse(res, {}, 404, 'Không tìm thấy danh mục');
        }
        return successResponse(res, {}, {}, 200, 'Xóa danh mục thành công');
    } catch (error) {
        return errorResponse(res, {}, 500, 'Lỗi khi xóa danh mục');
    }
};