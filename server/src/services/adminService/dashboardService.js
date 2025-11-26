const bookingModel = require('../../models/booking.model')
const Orders = require('../../models/order.model')
const checkout = require('../../models/checkout.model')
const getAllBookings = async (req, res) => {
    try {
        // populate đến bảng khác, select là các trường cần lấy
        // sort theo trường createdAt giảm dần
        const getAll = await bookingModel.find().sort({ createdAt: -1 })
            .populate({
                path: "customerId",
                select: "fullName email -_id"
            }).populate({
                path: 'serviceId',
                select: 'name basePrice -_id'
            }).populate({
                path: 'branchId',
                select: 'name _id'
            }).populate({
                path: 'staffId',
                select: 'userId -_id', // Chỉ lấy userId, loại bỏ các trường khác của staffId
                populate: {
                    path: 'userId',
                    select: 'fullName -_id'
                }
            })
        return getAll;
    } catch (error) {
        console.error("Error fetching bookings:", error);
        throw new Error("Failed to fetch bookings");
    }
}

const getAllOrders = async () => {
    try {
        const getAll = await checkout.find()
            .sort({ createdAt: -1 })
            .populate({
                path: 'UserId',
                select: 'fullName email phoneNumber _id'
            })
            .populate('items.product')
        if (!getAll) {
            throw new Error('Không tìm thấy danh sách đơn hàng')
        }
        return getAll

    } catch (error) {
        console.log(error);
    }
}

const updateStatusShippingOrder = async (userId, orderCode, statusShipping) => {
    try {

        const checkOrderExist = await checkout.findOne({ UserId: userId, orderCode: orderCode });
        if (!checkOrderExist) {

            throw new Error('Không tìm thấy đơn hàng')
        }

        const updateStatus = await checkout.findOneAndUpdate({ UserId: userId, orderCode: orderCode }, { statusShipping }, { new: true })
            .populate({
                path: 'UserId',
                select: 'fullName email phoneNumber _id'
            })
            .populate('items.product');
        return updateStatus
    } catch (error) {
        console.log(error);
        throw new Error(error)
    }
}

module.exports = {
    getAllBookings,
    getAllOrders,
    updateStatusShippingOrder
}