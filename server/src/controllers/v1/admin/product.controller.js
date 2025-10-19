const productService = require('../../../services/adminService/productServices');
const { successResponse, errorResponse } = require('../../../utils/response');
const Product = require('../../../models/product.model');
exports.getAllProducts = async (req, res) => {
    try {
        const products = await productService.getAllProducts();
        return successResponse(res, products, {}, 200, 'Lấy danh sách sản phẩm thành công');
    } catch (error) {
        return errorResponse(res, {}, 500, 'Lỗi khi lấy danh sách sản phẩm');
    }
};

// Thay đổi trạng thái sản phẩm
exports.changeProductStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        if (typeof status !== 'boolean') {
            return errorResponse(res, {}, 400, 'Trạng thái không hợp lệ');
        }
        const updated = await productService.changeProductStatus(id, status);
        if (!updated) {
            return errorResponse(res, {}, 404, 'Không tìm thấy sản phẩm');
        }
        return successResponse(res, updated, {}, 200, 'Cập nhật trạng thái sản phẩm thành công');
    } catch (error) {
        return errorResponse(res, {}, 500, 'Lỗi khi cập nhật trạng thái sản phẩm');
    }
};

exports.createProduct = async (req, res) => {
    try {
        const images = req.files.map(file => file.path);
        const { name, price, salePrice, description, category, stock } = req.body;
        const productData = {
            name,
            price,
            salePrice,
            stock,
            description,
            category,
            images,
        }
        //check if name is already exists
        const existingProduct = await productService.getProductByName(name);
        if (existingProduct) {
            return errorResponse(res, "Tên sản phẩm đã tồn tại", 400, 'Tên sản phẩm đã tồn tại');
        }
        const product = await productService.createProduct(productData);
        return successResponse(res, product, {}, 201, 'Tạo sản phẩm thành công');
    } catch (error) {
        return errorResponse(res, error.message, 500, 'Lỗi khi tạo sản phẩm');
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        if (req.files.length > 0) {
            const images = req.files.map(file => file.path);
            req.body.images = images;
        }

        const product = await Product.findById(id);
        const images = product.images;

        req.body.images = [...images, ...req.body.images];

        const existingProduct = await productService.getProductByName(name);
        if (existingProduct && existingProduct._id.toString() !== id) {
            return errorResponse(res, "Tên sản phẩm đã tồn tại", 400, 'Tên sản phẩm đã tồn tại');
        }
        const updated = await productService.updateProduct(id, req.body);
        if (!updated) {
            return errorResponse(res, "Không tìm thấy sản phẩm", 404, 'Không tìm thấy sản phẩm');
        }

        return successResponse(res, updated, {}, 200, 'Cập nhật sản phẩm thành công');
    } catch (error) {
        return errorResponse(res, error.message, 500, 'Lỗi khi cập nhật sản phẩm');
    }
};
