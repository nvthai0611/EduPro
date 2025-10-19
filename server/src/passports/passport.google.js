const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { COUPON_FIRST_LOGIN } = require("../constain/coupon");
const Provider     = require("../models/provider.model");
const User         = require("../models/user.model");
const UserCoupon   = require("../models/user_coupon");

module.exports = new GoogleStrategy(
  {
    clientID:     process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:  process.env.GOOGLE_CALLBACK_URL,
    scope: ["profile", "email"],
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const {
        displayName: fullName,
        emails: [{ value: email }],
      } = profile;

      const user = await createProviderAndUser(email, fullName);

      // Không cho login nếu tài khoản bị vô hiệu hoá
      if (!user) return done(null, false);

      return done(null, user);
    } catch (err) {
      console.error("Google login error:", err);
      return done(err, null);
    }
  }
);

/* ------------ Helpers -------------- */

const findOrCreateProvider = async (name) => {
  const existing = await Provider.findOne({ name });
  return existing || Provider.create({ name });
};

const giveFirstLoginCoupon = async (userId) => {
  // Tránh duplicate nhờ unique index hoặc check thủ công
  const already = await UserCoupon.exists({ userId, couponId: COUPON_FIRST_LOGIN });
  if (!already) {
    await UserCoupon.create({ userId, couponId: COUPON_FIRST_LOGIN });
  }
};

const findOrCreateUser = async (email, providerId, fullName) => {
  let user = await User.findOne({ email });

  /* ---- 1. Tài khoản hoàn toàn mới ---- */
  if (!user) {
    user = await User.create({
      fullName,
      email,
      provider:  providerId, // “google”
      status:    true,
      isActive:  true,
      confirmEmail: true,
      isGuest:   false,
    });
    await giveFirstLoginCoupon(user._id);
  }

  /* ---- 2. Đã có nhưng là guest ---- */
  else if (user.isGuest) {
    user.set({
      fullName: fullName || user.fullName, // giữ tên cũ nếu Google không có
      provider: providerId,
      isGuest:  false,
      status:   true,
      isActive: true,
      confirmEmail: true,
    });
    await user.save();
    await giveFirstLoginCoupon(user._id);
  }

  /* ---- 3. Đã có & không phải guest ---- */

  // Check khoá tài khoản
  if (!user.status || !user.isActive || !user.confirmEmail) {
    return null;
  }
  if(user.role !== "customer" && user.role !== "user"){
    return null;
  }

  return user;
};

const createProviderAndUser = async (email, fullName) => {
  const provider = await findOrCreateProvider("google");
  return findOrCreateUser(email, provider._id, fullName);
};
