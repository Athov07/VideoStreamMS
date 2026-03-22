import dotenv from "dotenv";
dotenv.config();
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/user.model.js';

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK,
    scope: ['profile', 'email']
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
            // Requirement: Split Google display name into First/Last
            const nameParts = profile.displayName.split(" ");
            user = await User.create({
                googleId: profile.id,
                email: profile.emails[0].value,
                firstName: nameParts[0],
                lastName: nameParts.slice(1).join(" "),
                isVerified: true
            });
        }
        return done(null, user);
    } catch (err) {
        return done(err, null);
    }
  }
));

// Required for passport sessions (even if using JWT)
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

export default passport;