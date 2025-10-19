import { apiClient } from "../../utils/clientAxios";


export const getAllUserCoupons= async (id) => {
    const response = await apiClient.get(`/users/${id}/coupons`);
    return response.data;
};

