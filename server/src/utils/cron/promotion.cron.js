const cron = require("node-cron");
const Promotion = require("../../models/promotion.model");
const chalk = require("chalk");
const settingModel = require("../../models/setting.model");

function formatTimeVN(date) {
  return date.toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
}

// CRON: Chạy mỗi ngày lúc 2 giờ sáng
cron.schedule(
  "* * * * *",
  async () => {
    const key = 'promotionCleanup';
    const now = new Date();
    const nowVN = formatTimeVN(now);

    console.log(chalk.blue.bold(`\n[CRON – PROMOTION CLEANUP]  ${nowVN}`));
    console.log(chalk.gray(`Đang kiểm tra các promotion đã hết hạn...`));

    try {
      //check setting
      const setting = await settingModel.findOne({ key });
      if (setting && !setting.enabled) {
        console.log(chalk.yellow(`[CRON] ${key} đã tắt không thể kiểm tra promotion hết hạn.`));
        return;
      }
      const result = await Promotion.updateMany(
        {
          endDate: { $lt: now },
        },
        {
          $set: {
            isActive: false,
          },
        }
      );
      if (result.deletedCount > 0) {
        console.log(
          chalk.green(`✅ Đã xoá ${result.deletedCount} promotion hết hạn.`)
        );
      } else {
        console.log(
          chalk.yellow(`⚠️ Không có promotion nào hết hạn tại thời điểm này.`)
        );
      }
    } catch (error) {
      console.error(chalk.red(`❌ Lỗi khi xóa promotion: ${error.message}`));
    }
  },
  {
    scheduled: true, // ✅ Bắt buộc khi dùng timezone
    timezone: "Asia/Ho_Chi_Minh",
  }
);
