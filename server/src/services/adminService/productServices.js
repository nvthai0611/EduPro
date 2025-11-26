const Product = require('../../models/product.model');
class ProductServiceService {
    async getAllProducts() {
        return await Product.find().populate('category', 'name description status').sort({ createdAt: -1 });
    }
    async changeProductStatus(id, status) {
        return await Product.findByIdAndUpdate(id, { status }, { new: true });
    }
    async createProduct(data) {
        const product = new Product(data);
        return await product.save();
    }
    async updateProduct(id, data) {
        return await Product.findByIdAndUpdate(id, data, { new: true });
    }
    async getProductByName(name) {
        return await Product.findOne({ name });
    }
}

module.exports = new ProductServiceService();
