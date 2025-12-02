import cron from "node-cron";
import User from "../../modules/user/user.model";
import { decodeToken } from "../jwt";
import { Request, Response } from "express";

// Chạy ngày 1 lần vào lúc 00:00 để xoá các sessionToken đã hết hạn
cron.schedule("*0 0 * * *", async () => {
  try {
    const result = await User.updateMany({ sessionTokenExpiresAt: { $lt: new Date() } }, { $unset: { sessionToken: "" }, $set: { sessionTokenExpiresAt: "" } });

    console.log(`[CRON] Cleared expired session tokens: ${result.modifiedCount}`);
  } catch (error) {
    console.error("[CRON ERROR] Failed to clear sessions:", error);
  }
});
