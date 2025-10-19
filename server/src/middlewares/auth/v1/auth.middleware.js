const User = require("../../../models/user.model");
const BlackLists = require("../../../models/blacklist.model");
const { verifyToken } = require("../../../utils/jwt");
const UserTransformer = require("../../../transformers/user.transformers");
const { successResponse, errorResponse } = require("../../../utils/response");
const { AUTH_MESSAGES, AUTH_STATUS, TYPE_AUTH } = require("../../../constain/auth");

module.exports = async (req, res, next) => {
  try {
    const accessToken = req.headers.authorization.split(" ")[1];
    if (!accessToken) {
      return errorResponse(res, {}, 401, AUTH_MESSAGES.UNAUTHORIZED);
    }

    const tokenBlackList = await BlackLists.findOne({ token: accessToken });
    if (tokenBlackList) {
      return errorResponse(res, {}, 401, AUTH_MESSAGES.UNAUTHORIZED);
    }
    const decode = await verifyToken(accessToken);
    if (!decode) {
      return errorResponse(res, {}, 401, AUTH_MESSAGES.UNAUTHORIZED);
    }
    const user = await User.findById(decode.userId);

    if (!user) {
      return errorResponse(res, {}, 401, AUTH_MESSAGES.UNAUTHORIZED);
    }

    if (!user.status || user.isActive === false || user.confirmEmail === false) {
      return errorResponse(res, {}, 401, AUTH_MESSAGES.BLOCKED_ACCOUNT);
    }
    if (user.status === AUTH_STATUS.INACTIVE) {
      return errorResponse(res, {}, 401, AUTH_MESSAGES.INACTIVE_ACCOUNT);
    }
    if (user.status === AUTH_STATUS.BLOCKED) {
      return errorResponse(res, {}, 401, AUTH_MESSAGES.BLOCKED_ACCOUNT);
    }
    if (user.status === AUTH_STATUS.PENDING) {
      return errorResponse(res, {}, 401, AUTH_MESSAGES.PENDING_ACCOUNT);
    }
    req.user = new UserTransformer(user);
    req.token = {
      accessToken,
    };
    next();
  } catch (error) {
    return errorResponse(res, {}, 401, AUTH_MESSAGES.UNAUTHORIZED);
  }
};

// if (user.role.name !== "Admin" && req.originalUrl.includes("/admin")) {
//   return res.status(404).json({
//     success: false,
//     message: "Bạn không có quyền truy cập vì đây dành cho admin",
//   });
// }

// if (user.role !== "staff" && req.originalUrl.includes("/staff")) {
//   return res.status(404).json({
//     success: false,
//     message: "Bạn không có quyền truy cập vì đây dành cho staff",
//   });

