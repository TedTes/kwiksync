import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { AppDataSource } from "../config";
import { User } from "../models";

const userRepository = AppDataSource.getRepository(User);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0].value;
        const name = profile.displayName;
        const picture = profile.photos?.[0]?.value;

        if (!email) {
          return done(new Error("No email found in Google profile"), undefined);
        }

        let user = await userRepository.findOneBy({ email });

        if (!user) {
          user = userRepository.create({
            email,
            name,
            picture,
            password: "",
            role: "merchant",
            googleId: profile.id,
          });
          await userRepository.save(user);
        }

        return done(null, {
          id: user.id,
          email: user.email,
          role: user.role,
          name: user.name,
          picture: user.picture,
        });
      } catch (error) {
        return done(error, undefined);
      }
    }
  )
);
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const parsedId = parseInt(id);
    const user = await userRepository.findOneBy({ id: parsedId });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});
