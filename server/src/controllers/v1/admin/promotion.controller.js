const promotionService = require('../../../services/adminService/promotionService');
const {successResponse, errorResponse} = require('../../../utils/response');

// Lấy tất cả promotion
exports.getAllPromotions = async (req, res) => {
  try {
    const promotions = await promotionService.getAllPromotions();
    return successResponse(res, promotions, {}, 200, 'Lấy danh sách promotion thành công');
  } catch (err) {
    return errorResponse(res, err.message, 500, 'Lấy danh sách promotion thất bại');
  }
};

// Lấy promotion theo id
exports.getPromotion = async (req, res) => {
  try {
    const promotion = await promotionService.getPromotionById(req.params.id);
    if (!promotion) return errorResponse(res, 'Promotion không tồn tại', 404, 'Promotion không tồn tại');
    return successResponse(res, promotion, {}, 200, 'Lấy promotion thành công');
  } catch (err) {
    return errorResponse(res, err.message, 500, 'Lấy promotion thất bại');
  }
};

// Tạo mới promotion
exports.createPromotion = async (req, res) => {
  try {

    //Check promotion name đã tồn tại chưa
    const promotionExist = await promotionService.getPromotionByName(req.body.name);
    if (promotionExist) return errorResponse(res, 'Tên promotion đã tồn tại', 400, 'Tên promotion đã tồn tại');

    const promotion = await promotionService.createPromotion(req.body);
    return successResponse(res, promotion, {}, 201, 'Tạo promotion thành công');
  } catch (err) {
    return errorResponse(res, err.message, 500, 'Tạo promotion thất bại');
  }
};

// Cập nhật promotion
exports.updatePromotion = async (req, res) => {
  try {
    //Check promotion name đã tồn tại chưa
    const promotionExist = await promotionService.getPromotionByName(req.body.name);
    if (promotionExist && promotionExist._id.toString() !== req.params.id) return errorResponse(res, 'Tên promotion đã tồn tại', 400, 'Tên promotion đã tồn tại');

    const promotion = await promotionService.updatePromotion(req.params.id, req.body);
    if (!promotion) return errorResponse(res, 'Promotion không tồn tại', 404, 'Promotion không tồn tại');
    return successResponse(res, promotion, {}, 201, 'Cập nhật promotion thành công');
  } catch (err) {
    return errorResponse(res, err.message, 500, 'Cập nhật promotion thất bại');
  }
};

// Chỉnh trạng thái isActive
exports.setPromotionActiveStatus = async (req, res) => {
  try {
    const { isActive } = req.body;
    const promotion = await promotionService.setPromotionActiveStatus(req.params.id, isActive);
    if (!promotion) return errorResponse(res, 'Promotion không tồn tại', 404, 'Promotion không tồn tại');
    return successResponse(res, promotion, {}, 201, 'Chỉnh trạng thái promotion thành công');
  } catch (err) {
    return errorResponse(res, err.message, 500, 'Chỉnh trạng thái promotion thất bại');
  }
};
