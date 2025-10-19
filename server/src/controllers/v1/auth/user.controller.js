const Provider = require("../../../models/provider.model");
const User = require("../../../models/user.model");
const { changePasswordByUserId, getUserProfile, changeUserProfile, changeImageProfile } = require("../../../services/userService/auth.service");
const bookingService = require("../../../services/userService/booking.service");
const couponService = require("../../../services/userService/coupon.service");
const { sentOtp, verifyOtp, resendOtp } = require("../../../services/userService/otp.service");
const ratingService = require("../../../services/userService/rating.service");
const UserTransform = require("../../../transformers/user.transformers");
const { successResponse, errorResponse } = require("../../../utils/response");

module.exports = {
  index: async (req, res) => {
    const users = await User.find();
    return successResponse(res, users, {}, 200, "Danh sách nguoi dung");
  },
  getProviders: async (req, res) => {
    const providers = await Provider.find();
    return res.json(providers);
  },
  getDetailUser: async (req, res) => {
    const id = req.params.id;
    try {
      const user = await User.findById(id);
      if (!user) {
        return errorResponse(res, {}, 404, "Không tìm thấy người dùng");
      }

      return successResponse(
        res,
        { ...user._doc, password: undefined },
        {},
        201,
        "Chi tiết người dùng"
      );
    } catch (error) {
      console.log(error);
    }
  },
  updateUser: async (req, res) => {
    console.log("Da vao backend");
    const { fullname, email, phoneNumber } = req.body;
    const image = req.file ? req.file.path : null; // xử lý ảnh
    const id = req.params.id;
    console.log(req.body, id);
    // return res.json(image);
    if (email) {
      return errorResponse(res, {}, 404, "Không được thay đổi email");
    }
    try {
      const user = await User.findById(id);
      if (!user) {
        return errorResponse(res, {}, 404, "Không tìm thấy người dùng");
      }
      //khong thay doi gi thi lay defaut
      user.fullname = fullname || user.fullname;
      //khong thay doi gi thi lay defaut
      user.imageUrl = image || user.imageUrl;
      //khong thay doi gi thi lay defaut
      user.phoneNumber = phoneNumber || user.phoneNumber;
      await user.save();
      return successResponse(
        res,
        new UserTransform(user),
        {},
        201,
        "Cập nhật người dùng thành công"
      );
    } catch (error) {
      console.log(error);
    }
  },

  getUserByEmail: async (req, res) => {
    const { email } = req.params;
    try {
      const user = await User.findOne({ email, status: true });

      if (!user) {
        return errorResponse(res, {}, 404, "Không tìm thấy người dùng");
      }
      return successResponse(
        res,
        new UserTransform(user),
        {},
        201,
        "Lấy dữ liệu người dùng"
      );
    } catch (error) {
      console.log(error);
    }
  },


  // Booking
  getAllBookingByID: async (req, res) => {
    try {
      const id = req.params.id;
      const bookings = await bookingService.getAllBookingById(id);

      return successResponse(res, bookings, {}, 200, "Lấy dữ liệu người dùng");
    } catch (error) {
      const status = error.status || 500;
      const message = error.message || "Lỗi khi lấy lịch hẹn";
      return errorResponse(res, error, status, message);
    }
  },
  getAllBookingPendingAndConfirm: async (req, res) => {
    try {
      const id = req.params.id;
      const bookings = await bookingService.getAllBookingPendindAndConfirmById(id);

      return successResponse(res, bookings, {}, 200, "Lấy dữ liệu người dùng");
    } catch (error) {
      const status = error.status || 500;
      const message = error.message || "Lỗi khi lấy lịch hẹn";
      return errorResponse(res, error, status, message);
    }
  },

  getAllBookingHistory: async (req, res) => {
    try {
      const id = req.params.id;
      const bookings = await bookingService.getAllBookingHistory(id);
      return successResponse(res, bookings, {}, 200, "Lấy dữ liệu người dùng");
    } catch (error) {
      const status = error.status || 500;
      const message = error.message || "Lỗi khi lấy lịch hẹn";
      return errorResponse(res, error, status, message);
    }
  },

  //rating
  createRating: async (req, res) => {
    try {
      const { rating, comment, bookingId, selectedOptions, serviceRatings, staffRatings } = req.body;
      const id = req.params.id;
      const result = await ratingService.createRating(
        id,
        bookingId,
        rating,
        comment,
        selectedOptions,
        serviceRatings,
        staffRatings
      );
      return successResponse(res, result, {}, 201, "Feedback thành công");
    } catch (error) {
      const status = error.status || 500;
      const message = error.message || "Lỗi khi feedback";
      return errorResponse(res, error, status, message);
    }
  },

  // Coupons
  getAllCoupons: async (req, res) => {
    try {
      const id = req.params.id;
      const coupons = await couponService.getAllCouponsByUserId(id);
      return successResponse(res, coupons, {}, 201, "Lấy dữ liệu mã giảm giá");
    } catch (error) {
      const status = error.status || 500;
      const message = error.message || "Lỗi khi lấy mã giảm giá";
      return errorResponse(res, error, status, message);
    }
  },

  validateCouponCode: async (req, res) => {
    const { code, orderTotal, selectedServices, orderPay } = req.body;
    const userId = req.user.UID;
    if (!code || !orderTotal) {
      return errorResponse(
        res,
        {},
        400,
        "Thiếu thông tin mã giảm giá hoặc tổng tiền"
      );
    }
    try {
      const result = await couponService.validateCouponCode(
        code,
        orderTotal,
        selectedServices,
        userId
      );
      return successResponse(res, result, {}, 200, "Mã giảm giá hợp lệ");
    } catch (error) {
      const status = error.status || 500;
      const message = error.message || "Lỗi khi xác thực mã giảm giá";
      return errorResponse(res, error, status, message);
    }
  },

  //Lien quan den user profile
  changePasswordController: async (req, res) => {
    try {
      const { oldPassword, newPassword } = req.body;
      console.log(req.body);

      const userId = req.user.UID;
      const result = await changePasswordByUserId(
        userId,
        oldPassword,
        newPassword
      );
      return successResponse(res, result, {}, 200, "Đổi mật khóa thành công");
    } catch (error) {
      const status = error.status || 500;
      const message = error.message || "Lỗi khi đổi mật khóa";
      return errorResponse(res, error, status, message);
    }
  },

  getUserProfileController: async (req, res) => {
    try {
      const userId = req.user.UID;
      const result = await getUserProfile(userId);
      return successResponse(res, result, {}, 200, "Lấy dữ liệu người dùng");
    } catch (error) {
      const status = error.status || 500;
      const message = error.message || "Lỗi khi lấy dữ liệu người dùng";
      return errorResponse(res, error, status, message);
    }
  },

  changeUserProfileController: async (req, res) => {
    try {
      const userId = req.user.UID;
      const { fullName, phoneNumber, email, birthDate } = req.body;
      console.log(req.body);

      const result = await changeUserProfile(userId, fullName, phoneNumber, email, birthDate);
      return successResponse(res, result, {}, 200, "Lấy dữ liệu người dùng");
    } catch (error) {
      const status = error.status || 500;
      const message = error.message || "Lỗi khi lấy dữ liệu người dùng";
      return errorResponse(res, error, status, message);
    }
  },
  changeImageProfileController: async (req, res) => {
    try {
      const userId = req.user.UID;

      console.log(req.file);
      console.log(req.body);

      const fileImage = req.file;
      if (fileImage === undefined) {
        return errorResponse(res, {}, 400, "Thieu file anh");
      }

      const result = await changeImageProfile(userId, fileImage.path);
      return successResponse(res, result, {}, 200, "Lấy dữ liệu người dùng");
    } catch (error) {
      const status = error.status || 500;
      const message = error.message || "Lỗi khi lấy dữ liệu người dùng";
      return errorResponse(res, error, status, message);
    }
  },
  //lien quan den OTP
  sendOTPController: async (req, res) => {
    try {
      const { email, type } = req.body;
      const result = await sentOtp(email, type)
      return successResponse(res, result, {}, 200, "Gửi OTP thành công");
    } catch (error) {
      const status = error.status || 500;
      const message = error.message || "Lỗi khi gửi OTP";
      return errorResponse(res, error, status, message);
    }
  },

  resendOTPController: async (req, res) => {
    try {
      const { email, type } = req.body;
      const result = await resendOtp(email, type)
      return successResponse(res, result, {}, 200, "Gửi lại OTP thành công");
    } catch (error) {
      const status = error.status || 500;
      const message = error.message || "Lỗi khi gửi lại OTP";
      return errorResponse(res, error, status, message);
    }
  },

  verifyOTPController: async (req, res) => {
    try {
      const { email, otp, type } = req.body;
      const result = await verifyOtp(email, otp, type)
      return successResponse(res, result, {}, 200, "Xác thực OTP thành công");
    } catch (error) {
      const status = error.status || 500;
      const message = error.message || "Lỗi khi xác thực OTP";
      return errorResponse(res, error, status, message);
    }
  },
};
