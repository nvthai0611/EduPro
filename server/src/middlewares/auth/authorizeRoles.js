const { errorResponse } = require("../../utils/response");

const authorizeRoles = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, {}, 401, "Chưa xác thực người dùng");
    }

    const userRole = req.user.role;
    
    if (!roles.includes(userRole)) {
      return errorResponse(res, {}, 403, "Bạn không có quyền truy cập vào tài nguyên này");
    }

    next();
  };
};

module.exports = { authorizeRoles };
