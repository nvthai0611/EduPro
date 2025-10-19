const jwt = require("../../../utils/jwt");
const { errorResponse } = require("../../../utils/response");

module.exports = async (req, res, next) => {
    const { accessToken } = req.token

    const decodeToken = await jwt.verifyToken(accessToken)
    req.user = decodeToken
    const role = decodeToken.role

    if (role !== "admin" && req.originalUrl.includes("/admin")) {
        return errorResponse(res, {}, 401, "Bạn không có quyền truy cập vào đây.");
    }
    next();
}