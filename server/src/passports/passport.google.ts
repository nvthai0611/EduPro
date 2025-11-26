import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import UserService from "../modules/user/user.service";

passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    },
    async (_accessToken: any, _refreshToken: any, profile: { displayName: any; emails: any; photos: any; }, done: (err: any, user?: any) => any) => {
      try {
        const { displayName: fullName, emails, photos } = profile;

        const email = emails?.[0]?.value;
        const image = photos?.[0]?.value;
        if (!email) return done(null, false);
        const user = await UserService.findOrCreateUser(email, "google", fullName, image);

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
