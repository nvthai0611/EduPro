import { apiClient } from "../../utils/clientAxios";

const addNewCoupon = async (data) => {
  console.log("Adding new coupon with data:", data);
  return await apiClient.post("/admin/coupon", data);
};

const getAllCoupon = async () => {
  return await apiClient.get("/admin/coupon");
};

const updateCoupon = async (couponId, data) => {
  return await apiClient.put(`/admin/coupon/${couponId}`, data);
};

const getCoupon = async (couponId) => {
  return await apiClient.get(`/admin/coupon/${couponId}`);
};

const getAllService = async () => {
  return await apiClient.get("/admin/service");
};

const deleteCoupon = async (couponId) => {
  return await apiClient.delete(`/admin/coupon/${couponId}`);
};

export {
  addNewCoupon,
  getAllCoupon,
  updateCoupon,
  getCoupon,
  getAllService,
  deleteCoupon,
};
