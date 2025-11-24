const Promotion = require('../../models/promotion.model');

// Lấy tất cả promotion
const getAllPromotions = async () => {
  return await Promotion.find();
};

// Lấy promotion theo id
const getPromotionById = async (id) => {
  return await Promotion.findById(id);
};

// Tạo mới promotion
const createPromotion = async (data) => {
  const promotion = new Promotion(data);
  return await promotion.save();
};

// Cập nhật promotion
const updatePromotion = async (id, data) => {
  return await Promotion.findByIdAndUpdate(id, data, { new: true });
};

// Chỉnh trạng thái isActive
const setPromotionActiveStatus = async (id, isActive) => {
  return await Promotion.findByIdAndUpdate(id, { isActive }, { new: true });
};

// Check promotion name đã tồn tại chưa
const getPromotionByName = async (name) => {
  return await Promotion.findOne({ name: { $regex: name, $options: 'i' } });
};

module.exports = {
  getAllPromotions,
  getPromotionById,
  createPromotion,
  updatePromotion,
  setPromotionActiveStatus,
  getPromotionByName,
};
