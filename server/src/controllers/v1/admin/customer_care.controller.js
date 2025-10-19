const { getAllCoupons } = require("../../../services/adminService/couponService")
const { getAllUserCustomer, getAllBooking, createUserCoupon, getAllCouponsUser } = require("../../../services/adminService/customer_careService")
const couponEmailQueue = require("../../../utils/queue/couponEmail.queue")
const { successResponse, errorResponse } = require("../../../utils/response")

const getAllUserCustomerController = async (req, res) => {
    try {
        const getAll = await getAllUserCustomer()
        return successResponse(res, getAll, {}, 200, "Lấy danh sách user customer thành công")
    } catch (error) {
        return errorResponse(res, {}, 500, "Lỗi khi lấy danh sách user customer");
    }
}

const getAllBookingController = async (req, res) => {
    try {
        const getAll = await getAllBooking()
        return successResponse(res, getAll, {}, 200, "Lấy danh sách booking thành công")
    } catch (error) {
        return errorResponse(res, {}, 500, "Lỗi khi lấy danh sách booking");
    }
}

const getAllCouponsController = async (req, res) => {
    try {
        const getAll = await getAllCoupons()
        return successResponse(res, getAll, {}, 200, "Lấy danh sách coupon thành công")
    } catch (error) {
        console.log(error);
        return errorResponse(res, {}, 500, "Lỗi khi lấy danh sách coupon");
    }
}

const createUserCouponController = async (req, res) => {
    try {
        const { userId, couponId, expireDate } = req.body
        console.log(req.body);

        const userCoupon = await createUserCoupon(userId, couponId, expireDate)
        return successResponse(res, userCoupon, {}, 200, "Tặng coupons cho người dùng thành công")
    } catch (error) {
        console.log();
        return errorResponse(res, {}, 500, error.message);
    }
}

const getAllUserCouponsController = async (req, res) => {
    try {
        const getAll = await getAllCouponsUser()
        return successResponse(res, getAll, {}, 200, "Lấy danh sách user coupons thành công")
    } catch (error) {
        return errorResponse(res, {}, 500, "Lỗi khi lấy danh sách user coupons");
    }
}

const sendGiftCouponController = async (req, res) => {
    try {
        const {
            selectedUserTypes,
            selectedCouponId,
            expireDate,
            emailSubject,
            emailMessage
        } = req.body;

        if (!selectedUserTypes || !Array.isArray(selectedUserTypes) || selectedUserTypes.length === 0) {
            return res.status(400).json({ message: "Phải chọn ít nhất một loại người dùng" });
        }

        // Đẩy job vào queue
        await couponEmailQueue.add({
            types: selectedUserTypes,
            couponId: selectedCouponId,
            expireDate,
            subject: emailSubject,
            bodyContent: emailMessage
        });
        return successResponse(res, null, {}, 200, "Hệ thống đang gửi email coupon. Vui lòng kiểm tra sau vài phút.");
    } catch (error) {
        console.log(error);
        return errorResponse(res, {}, error.status || 500, error.message || "Lỗi khi gửi coupon");
    }

}

module.exports = {
    getAllUserCustomerController,
    getAllBookingController,
    getAllCouponsController,
    createUserCouponController,
    getAllUserCouponsController,
    sendGiftCouponController
}