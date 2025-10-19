const cron = require('node-cron');
const dayjs = require('dayjs');
const User = require('../../models/user.model.js');
const Coupon = require('../../models/coupon.model.js');
const SettingModel = require('../../models/setting.model')
const UserCoupon = require('../../models/user_coupon.js');
const sendEmail = require('../email.js');
const dotenv = require('dotenv');
const chalk = require("chalk");

dotenv.config();
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Tạo template email nhắc nhở coupon sắp hết hạn
function getCouponReminderEmailHTML({ userName, couponCode, discountType, discountValue, expireDate, couponLink }) {
  return `<!DOCTYPE html>
  <html lang="vi">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nhắc nhở Coupon sắp hết hạn</title>
    <style>
      body { background: #f5f5f5; font-family: Arial, sans-serif; margin: 0; padding: 0; }
      .container { background: #fff; max-width: 500px; margin: 40px auto; border-radius: 12px; box-shadow: 0 4px 16px rgba(0,0,0,0.08); overflow: hidden; }
      .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #fff; padding: 32px 0; text-align: center; }
      .header h1 { margin: 0; font-size: 28px; }
      .content { padding: 32px 24px; color: #333; }
      .coupon-box { background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 24px 0; text-align: center; }
      .coupon-code { font-size: 22px; font-weight: bold; color: #764ba2; letter-spacing: 2px; }
      .expire { color: #e74c3c; font-weight: bold; }
      .footer { background: #f8f9fa; color: #888; text-align: center; padding: 18px; font-size: 14px; }
      .btn {
        display: inline-block;
        margin-top: 18px;
        padding: 12px 28px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: #fff;
        border-radius: 6px;
        text-decoration: none;
        font-weight: bold;
        font-size: 16px;
        transition: background 0.2s;
      }
      .btn:hover { background: linear-gradient(135deg, #764ba2 0%, #667eea 100%); }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>🎁 Ưu đãi sắp hết hạn!</h1>
      </div>
      <div class="content">
        <p>Xin chào <strong>${userName}</strong>,</p>
        <p>Bạn có một mã giảm giá sắp hết hạn sử dụng. Đừng bỏ lỡ cơ hội nhận ưu đãi này nhé!</p>
        <div class="coupon-box">
          <div class="coupon-code">Mã: ${couponCode}</div>
          <div>Giá trị: <strong>${discountType === 'percentage' ? discountValue + '%' : discountValue.toLocaleString('vi-VN') + ' VNĐ'}</strong></div>
          <div>Hạn sử dụng: <span class="expire">${dayjs(expireDate).format('DD/MM/YYYY')}</span></div>
          <a class="btn" href="${couponLink}" target="_blank">Sử dụng ngay</a>
        </div>
        <p>Hãy sử dụng mã này trước khi hết hạn để nhận ưu đãi từ chúng tôi!</p>
      </div>
      <div class="footer">
        © 2025 Spa Booking. Cảm ơn bạn đã đồng hành cùng chúng tôi!
      </div>
    </div>
  </body>
  </html>`;
}

// Cron job: chạy mỗi ngày lúc 7h sáng 0 7 * * *
// Test thì là * * * * *
cron.schedule('0 7 * * *', async () => {
  const key = 'couponExpiryReminderEmail';
  const now = dayjs();
  const sevenDaysLater = now.add(7, 'day').endOf('day').toDate();
  const today = now.startOf('day').toDate();

  try {
    const setting = await SettingModel.findOne({ key });
    if (setting && !setting.enabled) {
      console.log(chalk.yellow(`[CRON] ${key} đang tắt không thể nhắc nhở người dùng về cupons hết hạn.`));
      return;
    }
    // Tìm các userCoupon sắp hết hạn (trong 7 ngày tới), chưa dùng, chưa gửi nhắc
    const soonExpiredCoupons = await UserCoupon.find({
      isUsed: false,
      reminder: false,
      expireDate: { $gte: today, $lte: sevenDaysLater },
    }).populate('userId').populate('couponId');

    for (const userCoupon of soonExpiredCoupons) {
      const user = userCoupon.userId;
      const coupon = userCoupon.couponId;
      if (!user?.email || !user.confirmEmail || !user.isActive) continue;
      if (!coupon) continue;

      // Gửi email nhắc nhở
      await sendEmail(
        user.email,
        'Nhắc nhở: Coupon của bạn sắp hết hạn',
        getCouponReminderEmailHTML({
          userName: user.fullName,
          couponCode: coupon.code,
          discountType: coupon.discountType,
          discountValue: coupon.discountValue,
          expireDate: userCoupon.expireDate,
          couponLink: `${FRONTEND_URL}` // hoặc đường dẫn phù hợp trên FE
        })
      );
      // Đánh dấu đã gửi nhắc nhở
      userCoupon.reminder = true;
      await userCoupon.save();
    }
    console.log(`[CRON] Đã gửi nhắc nhở coupon sắp hết hạn cho ${soonExpiredCoupons.length} user.`);
  } catch (err) {
    console.error('[CRON] Lỗi khi gửi nhắc nhở coupon:', err.message);
  }
}, {
  scheduled: true,
  timezone: 'Asia/Ho_Chi_Minh',
});

cron.schedule("*/15 * * * *", async () => {
  const now = new Date();
  console.log(`[CRON] [${now.toISOString()}] Bắt đầu xoá coupon hết hạn hoặc đã dùng.`);

  try {
    const result = await UserCoupon.deleteMany({
      $or: [
        { isUsed: true },
        { expireDate: { $lte: now } }
      ]
    });

    console.log(`[CRON] Đã xoá ${result.deletedCount} user coupons.`);
  } catch (error) {
    console.error("[CRON] Lỗi khi xoá coupon:", error);
  }
});