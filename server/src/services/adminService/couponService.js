const coupon = require("../../models/coupon.model");
const service = require("../../models/service.model");
const mongoose = require("mongoose");

class CouponServiceService {
  async getAllCoupons() {
    return await coupon.find({ isGift: true });
  }

  async getCoupon(id) {
    return await coupon.findById(id);
  }

  async createCoupon(couponData) {
    const code = couponData.code;
    const existingCoupon = await coupon.findOne({ code });
    if (existingCoupon) {
      throw new Error("Mã coupon đã tồn tại");
    }
    const newCoupon = {
      _id: new mongoose.Types.ObjectId(),
      code: couponData.code,
      discountType: couponData.type,
      discountValue: couponData.discount,
      applicableToAll: couponData.applicableToAll,
      applicableServices: couponData.applicableToAll
        ? []
        : couponData.applicableServices?.map(
          (service) => new mongoose.Types.ObjectId(service)
        ),
      startDate: new Date(couponData.startDate),
      endDate: new Date(couponData.endDate),
      maxUses: couponData.maxUses,
      minOrderAmount: couponData.minOrderAmount,
      isActive: couponData.isActive,
      createdAt: new Date(),
      updatedAt: new Date(),
      isGift: couponData.isGift || true,
    };
    return await coupon.create(newCoupon);
  }

  async updateCoupon(id, couponData) {
    const code = couponData.code;
    const existingCoupon = await coupon.findOne({ code });
    if (existingCoupon && existingCoupon._id.toString() !== id) {
      throw new Error("Mã coupon đã tồn tại");
    }
    const updatedCoupon = {
      code: couponData.code,
      discountType: couponData.type,
      discountValue: couponData.discount,
      applicableToAll: couponData.applicableToAll,
      applicableServices: couponData.applicableToAll
        ? []
        : couponData.applicableServices?.map(
          (service) => new mongoose.Types.ObjectId(service)
        ),
      startDate: new Date(couponData.startDate),
      endDate: new Date(couponData.endDate),
      maxUses: couponData.maxUses,
      minOrderAmount: couponData.minOrderAmount,
      isActive: couponData.isActive,
      createdAt: new Date(),
      updatedAt: new Date(),
      isGift: couponData.isGift || true,
    };
    return await coupon.findByIdAndUpdate(id, updatedCoupon);
  }

  async deleteCoupon(id) {
    const couponData = await coupon.findById(id);
    if (!couponData) {
      throw new Error("Coupon không tồn tại");
    }
    if (couponData.usedCount > 0) {
      throw new Error("Coupon đã được sử dụng! Không thể xóa coupon");
    }
    if (couponData.isActive) {
      throw new Error("Coupon đang hoạt động! Không thể xóa coupon");
    }
    return await coupon.findByIdAndDelete(id);
  }
}

module.exports = new CouponServiceService();
