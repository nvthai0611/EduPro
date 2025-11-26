const UserModel = require('../../models/user.model')
const BookingModel = require('../../models/booking.model')
const CouponModel = require('../../models/coupon.model')
const UserCouponModel = require('../../models/user_coupon')
const sendEmail = require('../../utils/email')
const { couponsGift } = require('../../utils/templateString/emailContent')

//get all users co role la customer
const getAllUserCustomer = async () => {
    try {
        const getAll = await UserModel.find({ role: 'customer' })
        if (!getAll) {
            throw new Error('not found')
        }
        return getAll
    } catch (error) {
        console.log(error);
        throw error
    }
}

//get all booking

const getAllBooking = async () => {
    try {
        const getAll = await BookingModel.find()
        if (!getAll) {
            throw new Error('not found')
        }
        return getAll
    } catch (error) {
        console.log(error);
        throw error
    }
}
//get all coupons
const getAllCoupons = async () => {
    try {
        const getAll = await CouponModel.find()
        if (!getAll) {
            throw new Error('not found')
        }
        return getAll
    } catch (error) {
        console.log(error);
        throw error
    }
}
//ham tao userCoupons
const createUserCoupon = async (userId, couponId, expireDate) => {
    try {
        const user = await UserModel.findById(userId)
        if (!user) {
            throw new Error('User not found')
        }
        const coupon = await CouponModel.findById(couponId)
        if (!coupon) {
            throw new Error('Coupon not found')
        }
        // ✅ Kiểm tra tồn tại và còn hạn
        const now = new Date();
        const existingCoupon = await UserCouponModel.findOne({
            userId,
            couponId,
            expireDate: { $gt: now }  // còn hạn
        });
        if (existingCoupon) {
            console.log('⚠️ User đã có coupon còn hạn');
            throw new Error('Người dùng đã có coupons này và chưa dùng'); // hoặc return null/throw nếu muốn chặn tạo lại
        }
        const userCoupon = new UserCouponModel({ userId, couponId, expireDate })
        await userCoupon.save()
        return userCoupon
    } catch (error) {
        console.log(error)
        throw error
    }
}

//get all couponsUser
const getAllCouponsUser = async () => {
    try {
        const getAll = await UserCouponModel.find().populate('couponId')
        if (!getAll) {
            throw new Error('not found')
        }
        return getAll
    } catch (error) {
        console.log(error);
        throw error
    }
}

// const sendEmailCouponsProgram = async (types, couponId, expireDate, subject, bodyContent) => {
//     try {
//         if (!Array.isArray(types) || types.length === 0) {
//             return "Hãy chọn ít nhất 1 loại người dùng";
//         }

//         const coupon = await CouponModel.findById(couponId);
//         if (!coupon) {
//             return "Không tìm thấy coupon";
//         }

//         // Lấy tất cả khách hàng có type nằm trong danh sách
//         const customers = await UserModel.find({
//             role: 'customer',
//             type: { $in: types },
//         });

//         if (!customers.length) {
//             return "Không thấy khách hàng có type nằm trong danh sách";
//         }

//         let countSendEmailSuccess = 0;

//         for (const user of customers) {
//             // Kiểm tra user đủ điều kiện nhận email
//             if (!user.email || !user.confirmEmail || !user.status) {
//                 continue;
//             }

//             // Kiểm tra xem user đã có coupon chưa
//             const alreadyHasCoupon = await UserCouponModel.exists({
//                 userId: user._id,
//                 couponId: coupon._id,
//             });

//             if (alreadyHasCoupon) {
//                 continue; // bỏ qua nếu đã có
//             }

//             // Gán coupon cho user
//             await createUserCoupon(user._id, coupon._id, expireDate);

//             // Tạo nội dung email
//             const body = couponsGift(
//                 coupon.code,
//                 bodyContent,
//                 user.fullName,
//                 coupon.discountType,
//                 coupon.discountValue,
//                 expireDate
//             );

//             // Gửi email
//             await sendEmail(user.email, subject, body);

//             countSendEmailSuccess++;
//         }

//         return `Gửi thành công ${countSendEmailSuccess} email`;
//     } catch (error) {
//         console.error("Lỗi khi gửi email coupon:", error);
//         throw error;
//     }
// };

module.exports = {
    getAllUserCustomer,
    getAllBooking,
    getAllCoupons,
    createUserCoupon,
    getAllCouponsUser
}