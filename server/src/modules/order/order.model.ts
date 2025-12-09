import mongoose, { Schema, Document, Types } from "mongoose";

export type OrderStatus = "pending" | "processing" | "completed" | "cancelled" | "failed";
export type PaymentMethod = "payos" | "zalo" | "momo" | "bank_transfer" | "sepay" | "free";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface IOrder extends Document {
  userId: Types.ObjectId;

  // 1 order = 1 khóa học duy nhất
  courseId: Types.ObjectId;
  courseTitle: string;
  price: number;
  notes: string;

  statusOrder: OrderStatus;
  paymentMethod: PaymentMethod;

  paymentId?: string;
  paymentStatus: PaymentStatus;

  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;

  markAsPaid(): Promise<IOrder>;
}

const orderSchema = new Schema<IOrder>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },

    // Chỉ thanh toán 1 khóa học
    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    courseTitle: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },

    statusOrder: {
      type: String,
      enum: ["pending", "processing", "completed", "cancelled", "failed"],
      default: "pending",
    },

    paymentMethod: {
      type: String,
      enum: ["payos", "zalo", "momo", "sepay", "free"],
      required: true,
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
    expiresAt: { type: Date, required: false },
  },
  { collection: "Orders", timestamps: true }
);

// Index tối ưu
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ courseId: 1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ statusOrder: 1 });

// Index TTL cho trường expiresAt
orderSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });  // TTL sẽ tự động xóa bản ghi khi expiresAt đến


orderSchema.pre<IOrder>("save", function (next) {
  if (!this.notes) {
    this.notes = this._id.toString(); // set notes = orderId
  }

  // Nếu là bản ghi có statusOrder = "pending" và paymentStatus = "pending", thiết lập expiresAt
  if (this.statusOrder === "pending" && this.paymentStatus === "pending") {
    this.expiresAt = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000);  // Tự động xóa nếu còn pending sau 1 ngày
  } else {
    // Nếu không, không cần thiết lập expiresAt
    this.expiresAt = null;
  }

  next();
});

// ----- Method -----
orderSchema.methods.markAsPaid = async function (this: IOrder) {
  this.statusOrder = "completed";
  this.paymentStatus = "paid";
  return this.save();
};

const Order = mongoose.model<IOrder>("Order", orderSchema);
export default Order;