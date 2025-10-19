const User = require("../../models/user.model");
const BlackLists = require("../../models/blacklist.model");
const { verifyToken } = require("../../utils/jwt");
const { errorResponse } = require("../../utils/response");

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return errorResponse(res, {}, 401, "Token không hợp lệ");
    }

    const accessToken = authHeader.split(" ")[1];
    if (!accessToken) {
      return errorResponse(res, {}, 401, "Token không được cung cấp");
    }

    // Check if token is blacklisted
    const tokenBlackList = await BlackLists.findOne({ token: accessToken });
    if (tokenBlackList) {
      return errorResponse(res, {}, 401, "Token đã bị vô hiệu hóa");
    }

    // Verify token
    const decode = await verifyToken(accessToken);
    if (!decode) {
      return errorResponse(res, {}, 401, "Token không hợp lệ");
    }

    // Get user
    const user = await User.findById(decode.userId);
    if (!user) {
      return errorResponse(res, {}, 401, "Người dùng không tồn tại");
    }

    // Check user status
    if (!user.isActive || !user.confirmEmail) {
      return errorResponse(res, {}, 401, "Tài khoản chưa được kích hoạt");
    }

    // Attach user to request
    req.user = {
      id: user._id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      image: user.image,
    };

    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return errorResponse(res, {}, 401, "Lỗi xác thực");
  }
};

module.exports = { authenticateToken };
