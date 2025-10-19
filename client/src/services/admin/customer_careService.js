import { apiClient } from "../../utils/clientAxios";

const getAllCustomer = async () => {
    return await apiClient.get("admin/customer-care/customer");
}

const getAllBooking = async () => {
    return await apiClient.get("admin/customer-care/booking");
}

const getAllCoupons = async () => {
    return await apiClient.get("admin/customer-care/coupons");
}

const createUserCoupon = async (data) => {
    return await apiClient.post("admin/customer-care/coupons", data);
}

const getAllCouponsUser = async () => {
    return await apiClient.get("admin/customer-care/user-coupons");
}

const sendGiftCoupon = async (data) => {
    return await apiClient.post("admin/customer-care/send-coupons", data);
}

export { getAllCustomer, getAllBooking, getAllCoupons, createUserCoupon, getAllCouponsUser, sendGiftCoupon }