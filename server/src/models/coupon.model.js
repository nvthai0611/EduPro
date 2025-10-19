const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true,
    },
    discountValue: {
      type: Number,
      required: true,
      min: 0,
    },
    applicableToAll: {
      type: Boolean,
      default: true, // true = áp dụng toàn bộ courses/bundles
    },
    applicableCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
    applicableBundles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bundle",
      },
    ],
    maxUses: {
      type: Number,
      min: 1,
    },
    usedCount: {
      type: Number,
      default: 0,
    },
    minOrderAmount: {
      type: Number,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  { collection: "Coupons", timestamps: true }
);

// Indexes
couponSchema.index({ code: 1 });
couponSchema.index({ isActive: 1 });
couponSchema.index({ startDate: 1, endDate: 1 });

// Method to check if coupon is valid
couponSchema.methods.isValid = function () {
  const now = new Date();
  
  // Check if coupon is active
  if (!this.isActive) return false;
  
  // Check if within date range
  if (this.startDate && now < this.startDate) return false;
  if (this.endDate && now > this.endDate) return false;
  
  // Check if max uses exceeded
  if (this.maxUses && this.usedCount >= this.maxUses) return false;
  
  return true;
};

// Method to check if coupon applies to item
couponSchema.methods.appliesToCourse = function (courseId) {
  if (this.applicableToAll) return true;
  return this.applicableCourses.some(
    (id) => id.toString() === courseId.toString()
  );
};

couponSchema.methods.appliesToBundle = function (bundleId) {
  if (this.applicableToAll) return true;
  return this.applicableBundles.some(
    (id) => id.toString() === bundleId.toString()
  );
};

// Method to calculate discount amount
couponSchema.methods.calculateDiscount = function (amount) {
  if (this.discountType === "percentage") {
    return Math.round((amount * this.discountValue) / 100);
  } else {
    return Math.min(this.discountValue, amount);
  }
};

// Method to increment usage
couponSchema.methods.incrementUsage = function () {
  this.usedCount += 1;
  return this.save();
};

const Coupon = mongoose.model("Coupon", couponSchema);
module.exports = Coupon;
