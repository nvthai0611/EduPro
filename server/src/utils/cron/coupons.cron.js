const cron = require('node-cron');
const chalk = require('chalk');
const dayjs = require('dayjs');
const User = require('../../models/user.model');
const Booking = require('../../models/booking.model');
const Coupon = require('../../models/coupon.model');
const UserCoupon = require('../../models/user_coupon');
const emailContent = require('../templateString/emailContent');
const sendEmail = require('../email');
const dotenv = require('dotenv');
const settingModel = require('../../models/setting.model');
dotenv.config();
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';


// ==================== HÀM TIỆN ÍCH ====================
/**
 * Format thời gian theo múi giờ Việt Nam
 * @param {Date} date - Thời gian cần format
 * @returns {string} Thời gian đã format theo định dạng Việt Nam
 */
function formatTimeVN(date) {
    return date.toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
}

/**
 * Tặng voucher cho user nếu chưa có
 * @param {string} userId - ID của user
 * @param {Object} coupon - Thông tin coupon
 */
async function giveCouponToUser(userId, coupon, expireDate) {
    // Kiểm tra xem user đã có voucher này chưa
    const existed = await UserCoupon.findOne({ userId, couponId: coupon._id });
    if (!existed) {
        // Nếu chưa có thì tạo mới UserCoupon
        await UserCoupon.create({ userId, couponId: coupon._id, isUsed: false, expireDate });
        console.log(chalk.green(`✅ Tặng voucher ${coupon.code} cho user ${userId}`));
        // Gửi email thông báo nếu user có email
        const user = await User.findById(userId);
        if (user && user.email) {
            const html = getCouponGiftEmailHTML({
                userName: user.fullName || user.email,
                couponCode: coupon.code,
                discountType: coupon.discountType,
                discountValue: coupon.discountValue,
                expireDate: dayjs(expireDate).format('DD/MM/YYYY'),
                couponLink: FRONTEND_URL,
            });
            try {
                await sendEmail(user.email, 'Chúc mừng! Bạn nhận được voucher', html);
                console.log(chalk.green(`📧 Đã gửi email voucher cho ${user.email}`));
            } catch (e) {
                console.log(chalk.red(`❌ Không gửi được email cho ${user.email}`), e);
            }
        }
    } else {
        console.log(chalk.yellow(`⚠️ User ${userId} đã có voucher ${coupon.code}`));
    }
}

// ==================== HÀM TEMPLATE EMAIL VOUCHER ĐẸP ====================
/**
 * Tạo email HTML đẹp khi tặng voucher mới cho user
 * @param {Object} params
 * @param {string} params.userName
 * @param {string} params.couponCode
 * @param {string} params.discountType
 * @param {number|string} params.discountValue
 * @param {string} params.expireDate (định dạng DD/MM/YYYY)
 * @param {string} params.couponLink
 */
function getCouponGiftEmailHTML({ userName, couponCode, discountType, discountValue, expireDate, couponLink }) {
    return `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Chúc mừng! Bạn nhận được voucher</title>
      <style>
        body { background: #f5f5f5; font-family: Arial, sans-serif; margin: 0; padding: 0; }
        .container { background: #fff; max-width: 500px; margin: 40px auto; border-radius: 14px; box-shadow: 0 4px 16px rgba(120,80,180,0.10); overflow: hidden; }
        .header { background: linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%); color: #fff; padding: 36px 0 18px 0; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; }
        .content { padding: 32px 24px; color: #333; text-align: center; }
        .coupon-box { background: #f8f9fa; border-radius: 10px; padding: 24px; margin: 28px 0; text-align: center; box-shadow: 0 2px 8px rgba(120,80,180,0.06);}
        .coupon-code { font-size: 22px; font-weight: bold; color: #a18cd1; letter-spacing: 2px; }
        .expire { color: #e74c3c; font-weight: bold; }
        .btn {
          display: inline-block;
          margin-top: 22px;
          padding: 15px 36px;
          background: linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%);
          color: #fff;
          border-radius: 8px;
          text-decoration: none;
          font-weight: bold;
          font-size: 18px;
          box-shadow: 0 2px 8px rgba(120,80,180,0.13);
          transition: background 0.2s;
        }
        .btn:hover { background: linear-gradient(135deg, #fbc2eb 0%, #a18cd1 100%); }
        .footer { background: #f8f9fa; color: #888; text-align: center; padding: 18px; font-size: 14px; }
        @media (max-width: 600px) {
          .container { max-width: 98vw; margin: 10px; border-radius: 10px; }
          .content { padding: 18px 4vw; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎁 Chúc mừng! Bạn nhận được voucher</h1>
        </div>
        <div class="content">
          <p>Xin chào <strong>${userName}</strong>,</p>
          <p>Bạn vừa nhận được một mã ưu đãi đặc biệt từ Spa:</p>
          <div class="coupon-box">
            <div class="coupon-code">Mã: ${couponCode}</div>
            <div>Giá trị: <strong>${discountType === 'percentage' ? discountValue + '%' : Number(discountValue).toLocaleString('vi-VN') + ' VNĐ'}</strong></div>
            <div>Hạn sử dụng: <span class="expire">${expireDate}</span></div>
            <a class="btn" href="${couponLink}" target="_blank">Khám phá Spa</a>
          </div>
          <p>Hãy sử dụng mã này để nhận ưu đãi khi đặt lịch tại Spa!</p>
        </div>
        <div class="footer">
          © ${new Date().getFullYear()} Spa Booking. Cảm ơn bạn đã đồng hành cùng chúng tôi!
        </div>
      </div>
    </body>
    </html>
  `;
}

// ==================== CRON 1: TẶNG VOUCHER SINH NHẬT ====================
/**
 * Cron job tặng voucher sinh nhật
 * - Chạy mỗi ngày lúc 1h sáng (0 1 * * *)
 * - Kiểm tra user có sinh nhật hôm nay
 * - Kiểm tra user có booking hoàn thành trong 1 năm qua không
 * - Nếu có thì tặng voucher "Voucher_Sinh_Nhat"
 */
cron.schedule('0 1 * * *', async () => {

    const key = 'birthdayCoupon';
    try {
        const setting = await settingModel.findOne({ key });
        if (setting && !setting.enabled) {
            console.log(chalk.yellow(`\n[CRON] ${key} đã tắt không thể tặng voucher sinh nhật.`));
            return;
        }
        const now = new Date();
        const today = dayjs(now);
        console.log(chalk.blue.bold(`\n[CRON – VOUCHER SINH NHAT]  ${formatTimeVN(now)}`));
        // Bước 1: Lấy coupon sinh nhật từ database
        const coupon = await Coupon.findOne({ code: 'Voucher_Sinh_Nhat', isActive: true });
        if (!coupon) {
            console.log(chalk.red('❌ Không tìm thấy coupon Voucher_Sinh_Nhat!'));
            return;
        }

        // Bước 2: Lấy danh sách user hợp lệ (đã xác nhận email, đang active, không phải guest)
        const users = await User.find({
            role: "customer",
            confirmEmail: true,        // Đã xác nhận email
            status: true,           // Tài khoản đang hoạt động
            isGuest: false,           // Không phải khách vãng lai
            birthDate: { $ne: null }, // Có ngày sinh nhật
        });

        console.log(chalk.cyan(`📋 Tìm thấy ${users.length} user để kiểm tra sinh nhật`));

        // Bước 3: Duyệt qua từng user để kiểm tra sinh nhật
        for (const user of users) {
            if (!user.birthDate) continue;

            const birth = dayjs(user.birthDate);
            // Kiểm tra xem hôm nay có phải sinh nhật không (chỉ so sánh ngày và tháng)
            if (birth.date() === today.date() && birth.month() === today.month()) {
                console.log(chalk.magenta(`🎂 User ${user._id} có sinh nhật hôm nay!`));

                // Bước 4: Kiểm tra booking hoàn thành trong 1 năm qua
                const oneYearAgo = today.subtract(1, 'year').toDate();
                const hasBooking = await Booking.exists({
                    customerId: user._id,
                    status: 'completed',           // Booking đã hoàn thành
                    dateTime: { $gte: oneYearAgo }, // Trong 1 năm qua
                    isDeleted: false,              // Chưa bị xóa
                });

                if (hasBooking) {
                    // Nếu có booking hoàn thành thì tặng voucher
                    const expireDate = dayjs().add(1, 'month').endOf('month').toDate(); //
                    await giveCouponToUser(user._id, coupon, expireDate);
                } else {
                    console.log(chalk.gray(`📝 User ${user._id} chưa có booking hoàn thành trong 1 năm qua.`));
                }
            }
        }

        console.log(chalk.green('✅ Hoàn thành kiểm tra voucher sinh nhật'));

    } catch (error) {
        console.error(chalk.red('❌ [CRON] Lỗi tặng voucher sinh nhật:'), error);
    }
}, {
    scheduled: true,
    timezone: 'Asia/Ho_Chi_Minh', // Sử dụng múi giờ Việt Nam
});

// ==================== CRON 2: TẶNG VOUCHER THÁNG ====================
/**
 * Cron job tặng voucher tháng
 * - Chạy vào 0h ngày đầu tiên của mỗi tháng (0 0 1 * *)
 * - Tặng voucher theo type của user:
 *   + normal: "Voucher_Thang_MM_YYYY_normal"
 *   + loyal: "Voucher_Thang_MM_YYYY_loyal"  
 *   + VIP: "Voucher_Thang_MM_YYYY_VIP"
 */

// * * * * * là chạy mỗi phút, dùng dể test là oke
cron.schedule('0 0 1 * *', async () => {
    const key = 'monthlyCoupon';
    const now = new Date();
    const month = dayjs(now).format('MM');
    const year = dayjs(now).format('YYYY');
    console.log(chalk.blue.bold(`\n[CRON – TẠO & TẶNG VOUCHER THÁNG] ${formatTimeVN(now)}`));

    try {
        const setting = await settingModel.findOne({ key });
        if (setting && !setting.enabled) {
            console.log(chalk.yellow(`⚠️ [CRON] ${key} đang bị tắt, dừng lại.`));
            return;
        }

        const types = ['normal', 'loyal', 'VIP'];
        const endDate = dayjs().endOf('month').toDate();
        const newCoupons = {};

        // Xoá coupon tháng cũ
        const deleted = await Coupon.deleteMany({
            code: { $regex: /^Voucher_Thang_\d{2}_\d{4}_(normal|loyal|VIP)$/ },
            endDate: { $lt: new Date() }
        });
        console.log(chalk.yellow(`🧹 Đã xoá ${deleted.deletedCount} coupon tháng cũ.`));

        // Tạo coupon mới cho từng loại user
        for (const type of types) {
            const code = `Voucher_Thang_${month}_${year}_${type}`;
            const coupon = await Coupon.create({
                code,
                discountType: 'fixed',
                discountValue: type === 'VIP' ? 100000 : type === 'loyal' ? 70000 : 50000,
                applicableToAll: true,
                maxUses: 1,
                usedCount: 0,
                isActive: true,
                startDate: now,
                endDate: endDate,
                isGift: false, // Không phải voucher tặng
            });
            newCoupons[type] = coupon;
            console.log(chalk.green(`✅ Tạo mới coupon ${code}`));
        }

        // Lấy danh sách user hợp lệ
        const users = await User.find({
            role: "customer",
            confirmEmail: true,
            status: true,
            isGuest: false,
            type: { $in: types },
        });

        console.log(chalk.cyan(`📋 Tìm thấy ${users.length} user để tặng voucher tháng`));

        // Tặng voucher
        for (const user of users) {
            const coupon = newCoupons[user.type];
            if (!coupon) continue;

            const existed = await UserCoupon.findOne({ userId: user._id, couponId: coupon._id });
            if (existed) {
                console.log(chalk.gray(`⚠️ User ${user._id} đã có coupon ${coupon.code}`));
                continue;
            }

            await UserCoupon.create({
                userId: user._id,
                couponId: coupon._id,
                isUsed: false,
                expireDate: endDate,
            });
            console.log(chalk.green(`🎁 Tặng coupon ${coupon.code} cho user ${user._id}`));

            if (user.email) {
                const html = getCouponGiftEmailHTML({
                    userName: user.fullName || user.email,
                    couponCode: coupon.code,
                    discountType: coupon.discountType,
                    discountValue: coupon.discountValue,
                    expireDate: dayjs(endDate).format('DD/MM/YYYY'),
                    couponLink: FRONTEND_URL,
                });
                try {
                    await sendEmail(user.email, 'Chúc mừng! Bạn nhận được voucher tháng', html);
                    console.log(chalk.green(`📧 Đã gửi email voucher cho ${user.email}`));
                } catch (e) {
                    console.log(chalk.red(`❌ Không gửi được email cho ${user.email}`), e);
                }
            }
        }

        console.log(chalk.green('✅ Hoàn thành tạo + tặng voucher tháng'));

    } catch (error) {
        console.error(chalk.red('❌ [CRON] Lỗi tạo/tặng voucher tháng:'), error);
    }
}, {
    scheduled: true,
    timezone: 'Asia/Ho_Chi_Minh',
});

