const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        type: {
          type: String,
          enum: ["course", "bundle"],
          required: true,
        },
        itemId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
        title: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
        discountedPrice: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
    statusOrder: {
      type: String,
      enum: ["pending", "processing", "completed", "cancelled", "failed"],
      default: "pending",
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    couponUsed: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coupon",
    },
    paymentMethod: {
      type: String,
      enum: ["payos", "zalo", "momo"],
      required: true,
    },
    paymentId: {
      type: String,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  { collection: "Orders", timestamps: true }
);

// Indexes
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ statusOrder: 1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ paymentId: 1 });

// Virtual for order total items
orderSchema.virtual("totalItems").get(function () {
  return this.items.length;
});

// Method to calculate totals
orderSchema.methods.calculateTotals = function () {
  this.subtotal = this.items.reduce(
    (sum, item) => sum + item.price,
    0
  );
  
  this.total = this.subtotal - this.discount;
  
  return this.save();
};

// Method to add item to order
orderSchema.methods.addItem = function (type, itemId, title, price, discountedPrice) {
  this.items.push({
    type,
    itemId,
    title,
    price,
    discountedPrice,
  });
  return this.calculateTotals();
};

// Method to apply coupon
orderSchema.methods.applyCoupon = function (coupon) {
  if (!coupon.isValid()) {
    throw new Error("Coupon is not valid");
  }
  
  this.couponUsed = coupon._id;
  this.discount = coupon.calculateDiscount(this.subtotal);
  this.total = this.subtotal - this.discount;
  
  return this.save();
};

// Method to mark as paid
orderSchema.methods.markAsPaid = function (paymentId) {
  this.statusOrder = "completed";
  this.paymentStatus = "paid";
  this.paymentId = paymentId;
  return this.save();
};

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
