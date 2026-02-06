import mongoose, { Schema, Document } from "mongoose";

export interface IAccessLog extends Document {
  ip: string;
  geo: string;
  method: string;
  url: string;
  status: number;
  responseTime: number;
  userId?: string;
  email?: string;
  createdAt: Date;
}

const AccessLogSchema = new Schema<IAccessLog>(
  {
    ip: { type: String, index: true },
    geo: { type: String },
    method: String,
    url: String,
    status: Number,
    responseTime: Number,
    userId: { type: String, index: true },
    email: { type: String },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false, collection: "AccessLogs" },
);

/**
 * TTL index
 * Ví dụ: tự động xóa log sau 7 ngày (604800 giây)
 */
AccessLogSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 60 * 60 * 24 * 7 }
);

export const AccessLogModel = mongoose.model<IAccessLog>(
  "AccessLog",
  AccessLogSchema
);
