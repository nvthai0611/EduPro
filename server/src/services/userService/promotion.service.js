const Promotion = require("../../models/promotion.model");

module.exports = {
  // Lấy danh sách khuyến mãi
  getAllPromotions: async () => {
    const now = new Date();
    const promotions = await Promotion.find({
      startDate: { $lte: now },
      endDate: { $gte: now },
      isActive: true,
    });
    return promotions;
  },
};
