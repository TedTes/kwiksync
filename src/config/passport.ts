import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { AppDataSource } from "../config";
import { User } from "../models";
import { envVariables } from "./env-variables";
const userRepository = AppDataSource.getRepository(User);
const { googleClientId, googleClientSecret, googleCallbackURL } = envVariables;
passport.use(
  new GoogleStrategy(
    {
      clientID: googleClientId,
      clientSecret: googleClientSecret,
      callbackURL: googleCallbackURL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email: string = profile.emails?.[0].value as string;
        const name = profile.displayName;
        const picture = profile.photos?.[0]?.value;

        if (!email) {
          return done(new Error("No email found in Google profile"), undefined);
        }

        let user = await userRepository.findOneBy({ email });

        if (!user) {
          user = await userRepository.create({
            email,
            name,
            picture,
            password: "",
            refreshToken: accessToken,
            role: "merchant",
            googleId: profile.id,
          });
          await userRepository.save(user);
        } else if (!user.refreshToken) {
          user.refreshToken = accessToken;
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
