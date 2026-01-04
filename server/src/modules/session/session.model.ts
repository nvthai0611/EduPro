import mongoose, { Schema, Document, Types } from "mongoose";

export interface ISession extends Document {
  userId: Types.ObjectId;
  sessionId: string;
  deviceId: string;
  refreshTokenHash?: string;
  userAgent?: string;
  ip?: string;
  isValid: boolean;
  expiresAt: Date;
  lastActiveAt: Date;
}

const sessionSchema = new Schema<ISession>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    sessionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    deviceId: {
      type: String,
      required: true,
    },

    refreshTokenHash: String,

    userAgent: String,
    ip: String,

    isValid: {
      type: Boolean,
      default: true,
      index: true,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },

    lastActiveAt: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "Sessions", timestamps: true }
);

export default mongoose.model<ISession>("Session", sessionSchema);