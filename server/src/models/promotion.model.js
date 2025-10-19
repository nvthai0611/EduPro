const mongoose = require("mongoose");
const promotionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true,
    },
    maxDiscount: { type: Number, required: true },
    salePrice: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, collection: "Promotions" }
);
const Promotion = mongoose.model("Promotion", promotionSchema);
module.exports = Promotion;
