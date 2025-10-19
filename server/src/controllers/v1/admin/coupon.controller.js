const { successResponse, errorResponse } = require("../../../utils/response");
const couponService = require("../../../services/adminService/couponService");

exports.getAllCoupons = async (req, res) => {
  try {
    const coupons = await couponService.getAllCoupons();
    return successResponse(
      res,
      coupons,
      {},
      200,
      "Lấy danh sách coupon thành công"
    );
  } catch (error) {
    return errorResponse(res, {}, 500, error.message);
  }
};

exports.getCoupon = async (req, res) => {
  try {
    const coupon = await couponService.getCoupon(req.params.id);
    return successResponse(res, coupon, {}, 200, "Lấy coupon thành công");
  } catch (error) {
    return errorResponse(res, {}, 500, error.message);
  }
};

exports.createCoupon = async (req, res) => {
  try {
    const coupon = await couponService.createCoupon(req.body);
    return successResponse(res, coupon, {}, 200, "Tạo coupon thành công");
  } catch (error) {
    return errorResponse(res, {}, 500, error.message);
  }
};

exports.updateCoupon = async (req, res) => {
  try {
    const coupon = await couponService.updateCoupon(req.body.id, req.body);
    return successResponse(res, coupon, {}, 200, "Cập nhật coupon thành công");
  } catch (error) {
    return errorResponse(res, {}, 500, error.message);
  }
};

exports.deleteCoupon = async (req, res) => {
  try {
    const coupon = await couponService.deleteCoupon(req.params.id);
    return successResponse(res, coupon, {}, 200, "Xóa coupon thành công");
  } catch (error) {
    return errorResponse(res, {}, 500, error.message);
  }
};
