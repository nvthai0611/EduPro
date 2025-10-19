const User = require("../../../models/user.model");
const Staff = require("../../../models/staff.model");
const { TYPE_AUTH, AUTH_MESSAGES } = require("../../../constain/auth");
const { errorResponse } = require("../../../utils/response");

const staffMiddleware = async (req, res, next) => {
  try {
    const userObject = await User.findById(req.user.UID);
    if (
      userObject.role !== TYPE_AUTH.STAFF &&
      req.originalUrl.includes("/staff")
    ) {
      return errorResponse(res, {}, 401, AUTH_MESSAGES.UNAUTHORIZED);
    }

    const staff = await Staff.findOne({ userId: userObject._id });
    if (!staff) {
      return errorResponse(res, {}, 401, AUTH_MESSAGES.UNAUTHORIZED);
    }
    req.position = staff.position;
    req.branchId = staff.branchId || null;
    next();
  } catch (error) {
    return errorResponse(res, {}, 401, AUTH_MESSAGES.UNAUTHORIZED);
  }
};

const requirePosition = (position) => (req, res, next) => {
  if (req.position !== position) {
    return errorResponse(res, {}, 401, AUTH_MESSAGES.UNAUTHORIZED);
  }
  next();
};

module.exports = {
  staffMiddleware,
  requirePosition,
};
