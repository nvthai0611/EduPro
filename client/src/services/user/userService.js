import { apiClient } from '../../utils/clientAxios'

const changePassword = async (oldPassword, newPassword) => {
    return apiClient.put('/users/change-password', { oldPassword, newPassword });
}

const getUserProfile = async (id) => {
    // Nếu id là null, undefined hoặc "undefined", backend sẽ dùng req.user.id từ authenticateToken
    const url = id && id !== "undefined" ? `/users/user-profile/${id}` : `/users/user-profile/me`;
    return apiClient.get(url);
}

const changeImageProfile = async (image) => {
    return apiClient.put('/users/change-avatar', { image }, null, "multipart/form-data");
}

const changeUserProfile = async (userProfile) => {
    return apiClient.put('/users/change-user-profile', userProfile);
}

const sendOTP = async (email, type) => {
    return apiClient.post('/users/send-otp', { email, type });
}

const resendOTP = async (email, type) => {
    return apiClient.post('/users/resend-otp', { email, type });
}

const verifyOTP = async (email, otpCode, type) => {
    return apiClient.post('/users/verify-otp', { email, otp: otpCode, type });
}

export {
    changePassword,
    getUserProfile,
    changeImageProfile,
    changeUserProfile,
    sendOTP,
    resendOTP,
    verifyOTP
}