const Queue = require('bull');
const sendEmail = require('../email');
const CouponModel = require('../../models/coupon.model');
const UserModel = require('../../models/user.model');
const UserCouponModel = require('../../models/user_coupon');
const { couponsGift } = require('../templateString/emailContent');
// Khởi tạo queue
const couponEmailQueue = new Queue('couponEmailQueue', {
    redis: { host: '127.0.0.1', port: 6379 }
});

// Xử lý job
couponEmailQueue.process(async (job, done) => {
    const { types, couponId, expireDate, subject, bodyContent } = job.data;

    try {
        const coupon = await CouponModel.findById(couponId);
        if (!coupon) {
            const error = new Error();
            error.message = "Không tìm thấy coupon";
            error.status = 404;
            throw error;
        }

        const users = await UserModel.find({
            role: 'customer',
            type: { $in: types },
            status: true
        });

        if (!users.length) {
            const error = new Error();
            error.message = "Không thấy khách hàng có type nằm trong danh sách";
            error.status = 404;
            throw error;
        }

        let count = 0;

        for (const user of users) {
            if (!user.email || !user.confirmEmail || !user.status) continue;

            const exists = await UserCouponModel.exists({ userId: user._id, couponId: coupon._id });
            if (exists) continue;

            await UserCouponModel.create({
                userId: user._id,
                couponId: coupon._id,
                expireDate
            });

            const body = couponsGift(
                coupon.code,
                bodyContent,
                user.fullName,
                coupon.discountType,
                coupon.discountValue,
                expireDate
            );

            await sendEmail(user.email, subject, body);
            count++;
        }

        done(null, { count });
    } catch (error) {
        console.error("Lỗi khi xử lý job:", error);
        done(error);
        throw error;
    }
});

module.exports = couponEmailQueue;
