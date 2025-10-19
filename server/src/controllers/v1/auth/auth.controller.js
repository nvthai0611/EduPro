const { object, string } = require("yup");
const User = require("../../../models/user.model");
const { hashMake, hashCheck } = require("../../../utils/hash");
const { createAccessToken, refreshAccessToken } = require("../../../utils/jwt");
const BlackLists = require("../../../models/blacklist.model");
const Provider = require("../../../models/provider.model");
const OTP = require("../../../models/otp.model");
const sendEmail = require("../../../utils/email");
const {
  loginCustomerService,
  loginManagerService,
} = require("../../../services/authService/auth.services");
const AUTH_MESSAGES = require("../../../constain/auth");
const { successResponse, errorResponse } = require("../../../utils/response");
const cookieParser = require("cookie-parser");
const axios = require("axios");
const { linkResetPassword, confirmEmailResetPassword } = require("../../../services/userService/auth.service");
module.exports = {
  register: async (req, res) => {
    try {
      const body = req.body.data;
      console.log(body);

      let userSchema = object({
        fullName: string()
          .required("Vui lòng nhập họ và tên")
          .min(2, "Họ và tên phải có ít nhất 2 ký tự")
          .test(
            "no-numbers-special",
            "Họ và tên không được chứa số hoặc ký tự đặc biệt",
            (value) => {
              if (!value) return false;
              // Regex cho phép chữ cái (bao gồm tiếng Việt) và khoảng trắng
              return /^[\p{L}\s]+$/u.test(value);
            }
          ),

        email: string()
          .required("Email không được để trống")
          .email("Email không đúng định dạng. Ví dụ: user@example.com")
          .test("checkEmail", "Email đã tồn tại", async (value) => {
            const user = await User.findOne({ email: value });
            return !user;
          }),

        password: string()
          .required("Mật khẩu không được để trống")
          .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
          .test("uppercase", "Mật khẩu phải có ít nhất 1 chữ hoa", (value) => {
            if (!value) return false;
            return /[A-Z]/.test(value);
          })
          .test(
            "lowercase",
            "Mật khẩu phải có ít nhất 1 chữ thường",
            (value) => {
              if (!value) return false;
              return /[a-z]/.test(value);
            }
          )
          .test("number", "Mật khẩu phải có ít nhất 1 chữ số", (value) => {
            if (!value) return false;
            return /[0-9]/.test(value);
          }),

        phone: string()
          .required("Số điện thoại không được để trống")
          .test(
            "phone-format",
            "Số điện thoại không đúng định dạng",
            (value) => {
              if (!value) return false;
              // Regex cho số điện thoại Việt Nam
              return /^(0[3|5|7|8|9])+([0-9]{8})$/.test(value);
            }
          ),

        birthDate: string()
          .required("Ngày sinh không được để trống")
          .test(
            "age-check",
            "Bạn phải từ 12 tuổi trở lên để đăng ký tài khoản",
            (value) => {
              if (!value) return false;
              const birthDate = new Date(value);
              const today = new Date();
              const age = today.getFullYear() - birthDate.getFullYear();
              const monthDiff = today.getMonth() - birthDate.getMonth();
              const dayDiff = today.getDate() - birthDate.getDate();

              const actualAge =
                monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)
                  ? age - 1
                  : age;
              return actualAge >= 12;
            }
          ),

        confirmPassword: string()
          .required("Vui lòng xác nhận mật khẩu")
          .test(
            "passwords-match",
            "Mật khẩu xác nhận không khớp",
            function (value) {
              return this.parent.password === value;
            }
          ),
      });

      await userSchema.validate(body, {
        abortEarly: false,
      });

      // const apiKey = process.env.ABSTRACT_API_KEY;
      // const url = `https://emailvalidation.abstractapi.com/v1/?api_key=${apiKey}&email=${body.email}`;
      // const emailCheck = await axios.get(url);
      // const result = emailCheck.data;

      // if (
      //   !result.is_valid_format?.value || // sai định dạng
      //   !result.is_mx_found?.value || // không có MX record
      //   result.is_disposable_email?.value // là email rác (tạm thời)
      // ) {
      //   return res.status(400).json({
      //     message: "Email không hợp lệ hoặc là email rác!",
      //     detail: result,
      //   });
      // }

      // Hash password
      // body.password = await hashMake(body.password);

      // Remove confirmPassword before saving to database
      delete body.confirmPassword;

      const user = await User.create({ ...body, phoneNumber: body.phone, status: true, confirmEmail: true });
      return successResponse(res, {}, {}, 201, AUTH_MESSAGES.REGISTER_SUCCESS);
    } catch (e) {
      if (e.errors) {
        console.log(e.errors);
        const errors = Object.fromEntries(
          e.inner.map((err) => [err.path, err.message])
        );
        return res.status(400).json({
          message: errors,
        });
      }
      return res.status(500).json({
        message: e.message,
      });
    }
  },

  login: async (req, res) => {
    try {
      const body = req.body;
      // const apiKey = process.env.ABSTRACT_API_KEY; // dùng key của bạn
      // const url = `https://emailvalidation.abstractapi.com/v1/?api_key=${apiKey}&email=${email}`;
      // const emailCheck = await axios.get(url);
      // const result = emailCheck.data;

      // if (
      //   !result.is_valid_format?.value || // sai định dạng
      //   !result.is_mx_found?.value || // không có MX record
      //   result.is_disposable_email?.value // là email rác (tạm thời)
      // ) {
      //   return res.status(400).json({
      //     message: "Email không hợp lệ hoặc là email rác!",
      //     detail: result,
      //   });
      // }
      const { accessToken, user } = await loginCustomerService(body);
      console.log(user);
      return successResponse(
        res,
        { accessToken, user },
        null,
        200,
        AUTH_MESSAGES.LOGIN_SUCCESS
      );
    } catch (e) {
      if (e.name === "ValidationError" && e.inner) {
        const errors = Object.fromEntries(
          e.inner.map((err) => [err.path, err.message])
        );
        return res.status(400).json({ message: errors });
      }

      return res.status(400).json({
        message: e.message || AUTH_MESSAGES.SERVER_ERROR,
      });
    }
  },

  loginManager: async (req, res) => {
    try {
      const body = req.body;
      const { accessToken, refreshToken, user } = await loginManagerService(
        body
      );
      // Gửi refresh token trong HttpOnly cookie
      // res.cookie("refreshToken", refreshToken, {
      //   httpOnly: false,
      //   secure: false, // chỉ gửi qua HTTPS, nếu dev local thì có thể tắt
      //   sameSite: "Strict",
      //   maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
      // });

      return successResponse(
        res,
        { accessToken, user },
        null,
        200,
        AUTH_MESSAGES.LOGIN_SUCCESS
      );
    } catch (e) {
      if (e.name === "ValidationError" && e.inner) {
        // Lấy lỗi validation từ Yup
        const errors = Object.fromEntries(
          e.inner.map((err) => [err.path, err.message])
        );
        return res.status(400).json({ message: errors });
      }
      // Lỗi khác
      return res.status(400).json({
        message: e.message || AUTH_MESSAGES.SERVER_ERROR,
      });
    }
  },

  logout: async (req, res) => {
    try {
      const { accessToken } = req.token;

      if (!accessToken) {
        return errorResponse(res, {}, 401, AUTH_MESSAGES.UNAUTHORIZED);
      }

      const isProduction = process.env.NODE_ENV === "production";
      const cookieDomain = isProduction ? "haeispa.online" : undefined;

      const cookieOptions = {
        path: "/",
        domain: cookieDomain,
        sameSite: isProduction ? "None" : "Strict",
        secure: isProduction,
      };

      res.clearCookie("accessToken", cookieOptions);
      res.clearCookie("refreshToken", cookieOptions);
      res.clearCookie("user_data", cookieOptions);

      await BlackLists.create({
        token: accessToken,
      });

      return successResponse(res, {}, {}, 200, AUTH_MESSAGES.LOGOUT_SUCCESS);
    } catch (error) {
      return errorResponse(res, {}, 500, AUTH_MESSAGES.SERVER_ERROR);
    }
  },

  profile: async (req, res) => {
    try {
      const user = req.user;
      const ranking = req.ranking;
      return res.json({
        success: true,
        message: "Đăng nhập thành công. Chào mừng bạn trở lại!!!",
        data: ranking ? { ...user, ranking } : user,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Server chết",
      });
    }
  },
  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;

      // Kiểm tra email có tồn tại không
      const user = await User.findOne({ email }).populate("provider");
      if (!user) {
        return res.status(404).json({ message: "Email không tồn tại" });
      }

      // Kiểm tra tài khoản có đăng ký bằng email/password không
      const emailProvider = await Provider.findOne({ name: "email" });
      if (
        !user.provider ||
        user.provider._id.toString() !== emailProvider._id.toString()
      ) {
        return res.status(403).json({
          message: "Tài khoản này không thể đặt lại mật khẩu bằng email",
        });
      }

      // Tạo OTP ngẫu nhiên (6 chữ số)
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = Date.now() + 5 * 60 * 1000; // Hết hạn sau 5 phút

      // Xóa OTP cũ nếu có
      await OTP.deleteMany({ email });

      // Lưu OTP mới vào database
      await OTP.create({ email, otp, expiresAt });

      // Gửi email OTP cho người dùng
      await sendEmail(
        email,
        "Mã OTP đặt lại mật khẩu",
        `<h2>Mã OTP của bạn là: <b>${otp}</b></h2>
         <p>OTP này sẽ hết hạn sau 5 phút. Không chia sẻ mã này với bất kỳ ai.</p>`
      );

      return res.json({ message: "Mã OTP đã được gửi qua email" });
    } catch (error) {
      return res.status(500).json({ message: "Lỗi server" });
    }
  },

  resetPassword: async (req, res) => {
    try {
      const { email, otp, newPassword } = req.body;
      let userSchema = object({
        email: string()
          .required("Email hoặc mật khẩu không chính xác")
          .email("Email hoặc mật khẩu không chính xác"),
        newPassword: string()
          .required()
          .min(8, "Email hoặc mật khẩu không chính xác"),
      });
      await userSchema.validate(body, {
        abortEarly: false,
      });

      // Kiểm tra email có tồn tại không
      const user = await User.findOne({ email }).populate("provider");
      if (!user) {
        return res.status(404).json({ message: "Người dùng không tồn tại" });
      }

      // Kiểm tra tài khoản có đăng ký bằng email/password không
      const emailProvider = await Provider.findOne({ name: "email" });
      if (
        !user.provider ||
        user.provider._id.toString() !== emailProvider._id.toString()
      ) {
        return res.status(403).json({
          message: "Tài khoản này không thể đặt lại mật khẩu bằng email",
        });
      }

      // Kiểm tra OTP hợp lệ không
      const otpRecord = await OTP.findOne({ email, otp });
      if (!otpRecord) {
        return res.status(400).json({ message: "OTP không hợp lệ" });
      }
      if (otpRecord.expiresAt < Date.now()) {
        await OTP.deleteOne({ email, otp }); // Xóa OTP đã hết hạn
        return res.status(400).json({ message: "OTP đã hết hạn" });
      }

      // Băm mật khẩu mới
      const hashPassword = await hashMake(newPassword);

      // Cập nhật mật khẩu mới cho user
      await User.updateOne({ email }, { password: hashPassword });

      // Xóa OTP sau khi sử dụng
      await OTP.deleteOne({ email, otp });

      return res.json({
        message: "Mật khẩu đã được đặt lại thành công. Hãy đăng nhập!",
      });
    } catch (error) {
      return res.status(500).json({ message: "Lỗi server" });
    }
  },

  changePassword: async (req, res) => {
    try {
      const { email, oldPassword, newPassword } = req.body;

      // Validate dữ liệu nhập vào
      const userSchema = object({
        email: string()
          .required("Email không hợp lệ")
          .email("Email không hợp lệ"),
        oldPassword: string().required("Vui lòng nhập mật khẩu cũ"),
        newPassword: string()
          .required()
          .min(8, "Mật khẩu mới phải có ít nhất 8 ký tự"),
      });
      await userSchema.validate(req.body, { abortEarly: false });

      const userToken = req.user;

      if (userToken.email !== email) {
        return res.status(400).json({ message: "Email không trùng khớp" });
      }

      // Kiểm tra tài khoản có tồn tại không
      const user = await User.findOne({ email }).populate("provider");
      if (!user) {
        return res.status(404).json({ message: "Người dùng không tồn tại" });
      }

      // Kiểm tra tài khoản có đăng ký bằng email/password không
      const emailProvider = await Provider.findOne({ name: "email" });
      if (
        !user.provider ||
        user.provider._id.toString() !== emailProvider._id.toString()
      ) {
        return res
          .status(403)
          .json({ message: "Tài khoản này không thể thay đổi mật khẩu" });
      }

      // Kiểm tra mật khẩu cũ có đúng không
      const isMatch = await hashCheck(oldPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Mật khẩu cũ không chính xác" });
      }

      // Băm mật khẩu mới
      const hashedPassword = await hashMake(newPassword);

      // Cập nhật mật khẩu mới
      await User.updateOne({ email }, { password: hashedPassword });

      return res.json({ message: "Mật khẩu đã được cập nhật thành công!" });
    } catch (error) {
      console.error("Lỗi changePassword:", error);
      return res.status(500).json({ message: "Lỗi server" });
    }
  },

  verifyToken: async (req, res) => {
    try {
      const { accessToken } = req.token;
      const user = req.user;
      return successResponse(
        res,
        { accessToken, user },
        {},
        200,
        AUTH_MESSAGES.TOKEN_ACCEPT
      );
    } catch (error) {
      return errorResponse(
        res,
        error.message,
        500,
        AUTH_MESSAGES.TOKEN_INVALID
      );
    }
  },
  checkExistsPhoneOrEmail: async (req, res) => {
    try {
      const { phoneNumber, email } = req.body;
      console.log(phoneNumber, email);

      const checkPhone = await User.findOne({ phoneNumber });
      console.log(checkPhone);

      if (checkPhone) {
        return errorResponse(res, {}, 400, "Số điện thoại đã tồn tại");
      }
      const checkEmail = await User.findOne({ email });
      console.log(checkEmail);

      if (checkEmail) {
        return errorResponse(res, {}, 400, "Email đã tồn tại");
      }
      return successResponse(res, {}, null, 200, "Thành công");
    } catch (error) {
      console.log(error);

    }
  },
  sendLinkResetPassword: async (req, res) => {
    const { email } = req.body;
    console.log(email);

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return errorResponse(res, {}, 404, "Email không tồn tại");
      }
      const link = await linkResetPassword(email);
      return successResponse(res, link, null, 200, "Gửi email resetpassword thành công");
    } catch (error) {
      console.log(error);
      return errorResponse(res, error.message, error.status, error.message);
    }
  },
  confirmEmailResetPassword: async (req, res) => {
    const { token } = req.body;
    console.log(token);
    try {
      if (!token) {
        return errorResponse(res, {}, 400, "Token không hợp lệ");
      }
      const link = await confirmEmailResetPassword(token);
      return successResponse(res, link, null, 200, "Xác nhận email resetpassword thành công");
    } catch (error) {
      return errorResponse(res, error.message, error.status, error.message);
    }
  }
};
