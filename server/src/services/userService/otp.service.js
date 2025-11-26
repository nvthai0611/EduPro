const OtpModel = require('../../models/otp.model')
const UserModel = require('../../models/user.model')
const otpGenerator = require("otp-generator");
const { sendOTPFormat } = require('../../utils/templateString/emailContent');
const sendEmail = require('../../utils/email'); // Thêm import sendEmail
const axios = require("axios");
const OTP_TYPES = {
    REGISTER: 'register',
    LOGIN: 'login',
    FORGOT_PASSWORD: 'forgot_password',
    VERIFY_EMAIL: 'verify_email',
    CHANGE_EMAIL: 'change_email',
    // CHANGE_PASSWORD: 'change_password',
    // TWO_FACTOR: 'two_factor'
};

const sentOtp = async (email, type) => {
    try {
        if (!email || !type) {
            throw new Error('Email và type là bắt buộc');
        }

        if (!Object.values(OTP_TYPES).includes(type)) {
            throw new Error('Loại OTP không hợp lệ');
        }

        const apiKey = process.env.ABSTRACT_API_KEY;
        const url = `https://emailvalidation.abstractapi.com/v1/?api_key=${apiKey}&email=${email}`;
        const emailCheck = await axios.get(url);
        const result = emailCheck.data;

        if (
            !result.is_valid_format?.value || // sai định dạng
            !result.is_mx_found?.value || // không có MX record
            result.is_disposable_email?.value // là email rác (tạm thời)
        ) {
            const error = new Error('Email không hợp lệ hoặc không tồn tại');
            error.status = 400;
            throw error;
        }

        const normalizedEmail = email.toLowerCase().trim();

        // Kiểm tra email có tồn tại trong hệ thống không (tùy theo logic business)
        //Kiểm tra email ở bên ngoài trước rồi mới đến đây
        // Kiểm tra cooldown time cho việc gửi lại
        // await this.checkResendCooldown(normalizedEmail, type);

        // Xóa các OTP cũ chưa xác thực của cùng email và type
        await OtpModel.deleteMany({
            email: normalizedEmail,
            type: type,
            verified: false
        });

        // Tạo OTP mới
        const otp = otpGenerator.generate(6, { digits: true });
        // mặc định là 10 phút
        let expiryTime = new Date(Date.now() + 10 * 60 * 1000);
        if (type == "change_email") {
            // expiresAt = 15 phút
            expiryTime = new Date(Date.now() + 15 * 60 * 1000);
        }

        const newOTP = new OtpModel({
            email: normalizedEmail,
            otp: otp,
            type: type,
            expiresAt: expiryTime,
            verified: false
        });

        await newOTP.save();
        let form = sendOTPFormat(otp, 15);
        await sendEmail(normalizedEmail, "OTP", form);
        return "OTP đã được gửi đến email";

    } catch (error) {
        throw error;
    }
}

const resendOtp = async (email, type) => {
    try {
        if (!email || !type) {
            throw new Error('Email và type là bắt buộc');
        }

        const normalizedEmail = email.toLowerCase().trim();

        // Kiểm tra xem có OTP nào chưa xác thực và còn hạn không
        const existingOTP = await OtpModel.findOne({
            email: normalizedEmail,
            type: type,
            verified: false,
            expiresAt: { $gt: new Date() }
        }).sort({ createdAt: -1 });

        if (!existingOTP) {
            throw new Error('Không tìm thấy OTP nào để gửi lại hoặc OTP đã hết hạn');
        }

        // Gọi lại hàm gửi OTP
        return await sentOtp(email, type);

    } catch (error) {
        throw new Error(`Lỗi khi gửi lại OTP: ${error.message}`);
    }
};

const verifyOtp = async (email, otpCode, type) => {
    try {
        // Validate input
        if (!email || !otpCode) {
            throw new Error('Email và mã OTP là bắt buộc');
        }

        const normalizedEmail = email.toLowerCase().trim();
        const normalizedOTP = otpCode.trim();

        // Tìm OTP chưa xác thực và chưa hết hạn
        console.log(normalizedEmail, normalizedOTP, type);

        const otpRecord = await OtpModel.findOne({
            email: normalizedEmail,
            verified: false,
            type: type,
            expiresAt: { $gt: new Date() }
        }).sort({ createdAt: -1 });
        console.log(otpRecord);

        if (!otpRecord) {
            throw new Error('OTP không tồn tại, đã hết hạn hoặc đã được sử dụng');
        }

        if (otpRecord.otp !== normalizedOTP) {
            throw new Error('Mã OTP không chính xác');
        }

        // Đánh dấu OTP đã xác thực
        otpRecord.verified = true;
        await otpRecord.save();

        // Xóa các OTP khác cùng email
        await OtpModel.deleteMany({
            email: normalizedEmail,
            _id: { $ne: otpRecord._id }
        });

        return otpRecord;

    } catch (error) {
        throw new Error(`Lỗi khi xác thực OTP: ${error.message}`);
    }
};

module.exports = {
    sentOtp,
    resendOtp,
    verifyOtp
}