const Transformer = require("../core/transformers");

module.exports = class CouponTransformer extends Transformer {
  response(instance) {
    return {
      userId: instance.userId,
      isUsed: instance.isUsed,
      usedAt: instance.usedAt,
      couponId: instance?.couponId._id, // ID của UserCoupon
      code: instance?.couponId?.code,
      discountType: instance?.couponId?.discountType,
      discountValue: instance?.couponId?.discountValue,
      isUsed: instance?.isUsed,
      applicableToAll: instance?.couponId?.applicableToAll,
      startDate: instance?.couponId?.startDate,
      endDate: instance?.couponId?.endDate,
      minOrderAmount: instance?.couponId?.minOrderAmount,
      applicableServices: instance?.couponId?.applicableServices?.map((service) => ({
        serviceId: service?._id,
        name: service?.name,
        duration: service?.duration,
        price: service?.price,
      })) || [],
    };
  }
};
