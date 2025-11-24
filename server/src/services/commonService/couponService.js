const couponModel = require("../../models/coupon.model");
const userCouponModel = require("../../models/user_coupon");
const userModel = require("../../models/user.model");

class CouponService {
    async checkUsedCoupon(customerId, couponId) {
        const usedCoupon = await userCouponModel.findOne({ userId: customerId, couponId });
        return usedCoupon ? true : false;
    }
    async getCouponById(couponId) {
        const coupon = await couponModel.findById(couponId);
        return coupon;
    }
    async createUserCoupon(couponId, customerId) {
        const userCoupon = await userCouponModel.create({ userId: customerId, couponId, isUsed: false });
        return userCoupon;
    }
}

module.exports = new CouponService();