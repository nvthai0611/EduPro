const cron = require('node-cron');
const UserModel = require('../../models/user.model');
const settingModel = require('../../models/setting.model');
const BookingModel = require('../../models/booking.model');
const chalk = require("chalk");
const { getUserTypeUpgradeEmailContent } = require('../../services/staffService/email.service');
const sendEmail = require('../../utils/email');

// Chạy mỗi 15 phút (*/15)
cron.schedule('*/15 * * * *', async () => {
    const key = 'expiredUserCleanup';


    try {
        const setting = await settingModel.findOne({ key });
        if (setting && !setting.enabled) {
            console.log(chalk.yellow(`[CRON] ${key} đã tắt khoảng kiểm tra user chưa xóa nhận email.`));
            return;
        }
        const now = new Date();
        console.log(`[CRON] [${now.toISOString()}] Bắt đầu kiểm tra user chưa xác nhận và đã hết hạn.`);
        // Tìm trước để kiểm tra xem có user nào khớp không
        const expiredUsers = await UserModel.find({
            verifyExpiresAt: { $lt: now },
            confirmEmail: false,
            status: false
        });

        console.log(`[CRON] Tìm thấy ${expiredUsers.length} user cần xóa.`);
        expiredUsers.forEach(user => {
            console.log(` - ${user.email} | verifyExpiresAt: ${user.verifyExpiresAt.toISOString()}`);
        });

        // Tiến hành xóa
        const result = await UserModel.deleteMany({
            verifyExpiresAt: { $lt: now },
            confirmEmail: false,
            status: false
        });

        console.log(`[CRON] Đã xóa ${result.deletedCount} user.`);

    } catch (error) {
        console.error('[CRON] Lỗi khi xóa user:', error.message);
    }
}, {
    scheduled: true,
    timezone: "Asia/Ho_Chi_Minh"
});

// Cron job mới để cập nhật loại user dựa trên booking
cron.schedule('0 2 * * *', async () => { // Chạy mỗi ngày lúc 2h sáng
    const key = 'userTypeUpdate';

    try {
        const setting = await settingModel.findOne({ key });
        if (setting && !setting.enabled) {
            console.log(chalk.yellow(`[CRON] ${key} đã tắt khoảng cập nhật loại user.`));
            return;
        }

        console.log(`[CRON] [${new Date().toISOString()}] Bắt đầu cập nhật loại user dựa trên booking.`);

        // Lấy tất cả user có role customer
        const customers = await UserModel.find({ 
            role: 'customer', 
            isActive: true,
            isGuest: false 
        });

        let loyalCount = 0;
        let vipCount = 0;

        for (const customer of customers) {
            // Đếm số booking đã hoàn thành của user
            const completedBookings = await BookingModel.find({
                customerId: customer._id,
                status: 'completed',
                isDeleted: false
            });

            // Tính tổng tiền đã thanh toán
            const totalPaid = completedBookings.reduce((sum, booking) => {
                return sum + (booking.totalPay || 0);
            }, 0);

            const bookingCount = completedBookings.length;
            let newType = customer.type;

            // Cập nhật loại user
            if (bookingCount >= 10 && totalPaid >= 10000000) { // 10 booking và 10tr
                if (customer.type !== 'VIP') {
                    newType = 'VIP';
                    vipCount++;
                    console.log(`[CRON] Nâng cấp ${customer.email} lên VIP (${bookingCount} bookings, ${totalPaid.toLocaleString()} VNĐ)`);
                }
            } else if (bookingCount >= 3) { // 3 booking
                if (customer.type === 'normal') {
                    newType = 'loyal';
                    loyalCount++;
                    console.log(`[CRON] Nâng cấp ${customer.email} lên Loyal (${bookingCount} bookings)`);
                }
            }

            // Cập nhật nếu có thay đổi
            if (newType !== customer.type) {
                await UserModel.findByIdAndUpdate(customer._id, { type: newType });
                
                // Gửi email thông báo nâng cấp
                try {
                    const emailContent = getUserTypeUpgradeEmailContent(customer, newType, bookingCount, totalPaid);
                    await sendEmail(
                        customer.email,
                        `🎉 Chúc mừng! Bạn đã được nâng cấp lên ${newType.toUpperCase()}`,
                        emailContent
                    );
                    console.log(`[CRON] Đã gửi email thông báo nâng cấp cho ${customer.email}`);
                } catch (emailError) {
                    console.error(`[CRON] Lỗi gửi email cho ${customer.email}:`, emailError.message);
                }
            }
        }

        console.log(`[CRON] Hoàn thành cập nhật loại user:`);
        console.log(` - Nâng cấp lên Loyal: ${loyalCount} user`);
        console.log(` - Nâng cấp lên VIP: ${vipCount} user`);

    } catch (error) {
        console.error('[CRON] Lỗi khi cập nhật loại user:', error.message);
    }
}, {
    scheduled: true,
    timezone: "Asia/Ho_Chi_Minh"
});

// Cron job mới để ban tài khoản user có 3 booking no_show trở lên
cron.schedule('0 3 * * *', async () => { // Chạy mỗi ngày lúc 3h sáng
    const key = 'banUserNoShow';

    try {
        const setting = await settingModel.findOne({ key });
        if (setting && !setting.enabled) {
            console.log(chalk.yellow(`[CRON] ${key} đã tắt khoảng ban user no_show.`));
            return;
        }

        console.log(`[CRON] [${new Date().toISOString()}] Bắt đầu kiểm tra user có booking no_show.`);

        // Lấy tất cả user có role customer và đang active
        const customers = await UserModel.find({ 
            role: 'customer', 
            type: 'normal',
            isActive: true,
            isGuest: false 
        });

        let bannedCount = 0;

        for (const customer of customers) {
            // Đếm số booking no_show của user
            const noShowBookings = await BookingModel.find({
                customerId: customer._id,
                status: 'no_show',
                isDeleted: false,
            });

            const noShowCount = noShowBookings.length;

            // Ban tài khoản nếu có 3 booking no_show trở lên
            if (noShowCount >= 3) {
                await UserModel.findByIdAndUpdate(customer._id, { 
                    isActive: false,
                    status: false 
                });
                
                bannedCount++;
                console.log(`[CRON] Đã ban tài khoản ${customer.email} (${noShowCount} booking no_show)`);
            }
        }

        console.log(`[CRON] Hoàn thành kiểm tra user no_show:`);
        console.log(` - Đã ban: ${bannedCount} user`);

    } catch (error) {
        console.error('[CRON] Lỗi khi ban user no_show:', error.message);
    }
}, {
    scheduled: true,
    timezone: "Asia/Ho_Chi_Minh"
});

