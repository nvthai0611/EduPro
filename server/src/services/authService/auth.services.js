//trong nay xu ly cac logic
const { object, string } = require("yup");
const User = require("../../models/user.model");
const { hashCheck } = require("../../utils/hash");
const { createAccessToken, refreshAccessToken } = require("../../utils/jwt");
const {
  AUTH_MESSAGES,
  AUTH_STATUS,
  TYPE_AUTH,
} = require("../../constain/auth");
const UserTransformer = require("../../transformers/user.transformers");
const Staff = require("../../models/staff.model");

async function loginCustomerService(body) {
  // Validate input
  const { email, password } = body.data;
  console.log(email, password);
  const userSchema = object({
    email: string()
      .required(AUTH_MESSAGES.INVALID_EMAIL_OR_PASSWORD)
      .email(AUTH_MESSAGES.INVALID_EMAIL_OR_PASSWORD),
    password: string()
      .required(AUTH_MESSAGES.INVALID_EMAIL_OR_PASSWORD)
      .min(8, AUTH_MESSAGES.INVALID_EMAIL_OR_PASSWORD),
  });
  await userSchema.validate({ email, password }, { abortEarly: false });
  // Find user
  const user = await User.findOne({
    email: email,
  });
  if (!user) {
    throw new Error(AUTH_MESSAGES.INVALID_EMAIL_OR_PASSWORD);
  }
  // Check password
  const isPasswordValid = await hashCheck(password, user.password);
  if (!isPasswordValid) {
    throw new Error(AUTH_MESSAGES.INVALID_EMAIL_OR_PASSWORD);
  }
  if (user.status === AUTH_STATUS.INACTIVE) {
    throw new Error(AUTH_MESSAGES.INACTIVE_ACCOUNT);
  }
  if (user.status === AUTH_STATUS.BLOCKED) {
    throw new Error(AUTH_MESSAGES.BLOCKED_ACCOUNT);
  }
  if (user.status === AUTH_STATUS.PENDING) {
    throw new Error(AUTH_MESSAGES.PENDING_ACCOUNT);
  }
  // Create access token
  const accessToken = await createAccessToken({
    userId: user._id,
    role: user.role,
  });
  const refreshToken = await refreshAccessToken();
  return { accessToken, refreshToken, user: new UserTransformer(user) };
}

async function loginManagerService(body) {
  // Validate input
  const { email, password } = body.data;
  const userSchema = object({
    email: string()
      .required(AUTH_MESSAGES.INVALID_EMAIL_OR_PASSWORD)
      .email(AUTH_MESSAGES.INVALID_EMAIL_OR_PASSWORD),
    password: string()
      .required(AUTH_MESSAGES.INVALID_EMAIL_OR_PASSWORD)
      .min(8, AUTH_MESSAGES.INVALID_EMAIL_OR_PASSWORD),
  });
  await userSchema.validate({ email, password }, { abortEarly: false });
  // Find user
  const user = await User.findOne({
    email: email,
  });

  if (!user) {
    throw new Error(AUTH_MESSAGES.INVALID_EMAIL_OR_PASSWORD);
  }
  // Check password
  const isPasswordValid = await hashCheck(password, user.password);
  if (!isPasswordValid) {
    throw new Error(AUTH_MESSAGES.INVALID_EMAIL_OR_PASSWORD);
  }
  if (user.status === AUTH_STATUS.INACTIVE) {
    throw new Error(AUTH_MESSAGES.INACTIVE_ACCOUNT);
  }
  if (user.status === AUTH_STATUS.BLOCKED) {
    throw new Error(AUTH_MESSAGES.BLOCKED_ACCOUNT);
  }
  if (user.status === AUTH_STATUS.PENDING) {
    throw new Error(AUTH_MESSAGES.PENDING_ACCOUNT);
  }
  if (user.role === TYPE_AUTH.CUSTOMER || user.role === TYPE_AUTH.USER) {
    throw new Error(AUTH_MESSAGES.UNAUTHORIZED);
  }

  let role = user.role;
  let branchId = "";
  if (role !== "admin") {
    const staffRole = await Staff.findOne({ userId: user._id });
    role = staffRole.position === "serviceStaff" ? "staff" : "manager";
    branchId = staffRole.branchId;
  }
  const newUser = {
    ...user._doc,
    role,
  };
  // Create access token
  const accessToken = await createAccessToken({
    userId: newUser._id,
    role: newUser.role,
  });
  const refreshToken = await refreshAccessToken();
  return {
    accessToken,
    refreshToken,
    user: new UserTransformer({
      ...user._doc,
      branchId,
    }),
  };
}

module.exports = {
  loginManagerService,
  loginCustomerService,
};
