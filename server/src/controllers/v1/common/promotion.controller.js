const { successResponse, errorResponse } = require("../../../utils/response");
const PromotionService = require("../../../services/userService/promotion.service");
module.exports = {
  getAllPromotions: async (req, res) => {
    try {
      const result = await PromotionService.getAllPromotions();
      return successResponse(
        res,
        result,
        {},
        200,
        "Lấy danh sách khuyến mãi thành công"
      );
    } catch (err) {
      return errorResponse(res, err, 500, "Lỗi khi lấy danh sách khuyến mãi");
    }
  },
};
