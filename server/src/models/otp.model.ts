import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
    },
    otp: {
      type: String,
      required: true,
    },
    type: {
      type: String, //check xem day la dang hanh dong nao
      required: true
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, collection: "OTPs" }
);

const ForgotPassword = mongoose.model("OTP", otpSchema);

export default ForgotPassword;
