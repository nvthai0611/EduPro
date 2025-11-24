import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/user.model";

const findOrCreateUser = async (email: any, providerId: any, fullName: any) => {
  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({
      fullName,
      email,
      provider: providerId,
      status: true,
      isActive: true,
      confirmEmail: true,
      isGuest: false,
    });
  } else if (user.isGuest) {
    user.set({
      fullName,
      provider: providerId,
      isGuest: false,
      status: true,
      isActive: true,
      confirmEmail: true,
    });
    await user.save();
  }

  if (!user.status || !user.isActive || !user.confirmEmail) return null;
  if (user.role !== "customer" && user.role !== "user") return null;

  return user;
};

passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    },
    async (_accessToken: any, _refreshToken: any, profile: { displayName: any; emails: any; }, done: (arg0: null, arg1: boolean) => any) => {
      try {
        const { displayName: fullName, emails } = profile;

        const email = emails?.[0]?.value;
        const user = await findOrCreateUser(email, "google", fullName);

        if (!user) return done(null, false);
        return done(null, user);
      } catch (error) {
        console.error("Google login error:", error);
        return done(error, undefined);
      }
    }
  )
);

export default passport;
