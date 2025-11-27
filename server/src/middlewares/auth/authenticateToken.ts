import UserService from "../../modules/user/user.service";
// import { findOne } from "../../models/blacklist.model";
import { decodeToken } from "../../utils/jwt";
import { errorResponse } from "../../utils/response";

const authenticateToken = async (req, res, next) => {
  try {
    const accessToken = req.cookies?.render_id;
    if (!accessToken) {
      return errorResponse(res, {}, 401, "Token không hợp lệ hoặc không được cung cấp");
    }

    // Check if token is blacklisted
    // const tokenBlackList = await findOne({ token: accessToken });
    // if (tokenBlackList) {
    //   return errorResponse(res, {}, 401, "Token đã bị vô hiệu hóa");
    // }

    // Verify token
    const decode = await decodeToken(accessToken);
    if (!decode) {
      return errorResponse(res, {}, 401, "Token không hợp lệ");
    }

    // Get user
    const user = await UserService.getUserById(decode.userId);
    if (!user) {
      return errorResponse(res, {}, 401, "Người dùng không tồn tại");
    }

    // Check user status
    if (!user.isActive || !user.confirmEmail) {
      return errorResponse(res, {}, 401, "Tài khoản chưa được kích hoạt");
    }

    // Attach user to request
    req.user = {
      id: user["_id"],
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

export default authenticateToken;
