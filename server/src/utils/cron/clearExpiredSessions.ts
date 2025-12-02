import cron from "node-cron";
import User from "../../modules/user/user.model";

// Chạy mỗi giờ để xoá các sessionToken đã hết hạn
cron.schedule("0 * * * *", async () => {
  try {
    const result = await User.updateMany({ sessionTokenExpiresAt: { $lt: new Date() } }, { $unset: { sessionToken: "" }, $set: { sessionTokenExpiresAt: "" } });

    console.log(`[CRON] Cleared expired session tokens: ${result.modifiedCount}`);
  } catch (error) {
    console.error("[CRON ERROR] Failed to clear sessions:", error);
  }
});
