const { default: mongoose } = require("mongoose");

const userCouponSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    expireDate: {
      type: Date,
    },
    reminder: {
      type: Boolean,
      default: false,
    },
    couponId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coupon",
      required: true,
    },
    isUsed: { type: Boolean, default: false },
    usedAt: Date,
  },
  { timestamps: true }
);
module.exports = mongoose.model("UserCoupon", userCouponSchema, "UserCoupons");
