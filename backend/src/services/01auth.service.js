import passport from "passport";
import jwt from "jsonwebtoken";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import config, { prisma } from "../config/config.js"

passport.use(
    new GoogleStrategy({
        clientID: config.client_id,
        clientSecret: config.client_secret,
        callbackURL:"http://localhost:3000/auth/google/callback",
        proxy: true
    },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await prisma.user.findUnique({
                    where: {
                        googleId: profile.id
                    }
                });
                if (!user) {
                    const user = await prisma.user.create({
                        data: {
                            googleId: profile.id,
                            name: profile.displayName,
                            email: profile.emails?.[0].value,
                            profile: profile.photos?.[0].value,
                        }
                    })
                    return done(null, user);
                }

                return done(null, user);
            } catch (err) {
                console.log(err)
                return done(err, null)
            }
        }));


export async function newToken(refreshToken) {
  try {
    const decode = jwt.verify(refreshToken, config.refresh_secret);

    const user = await prisma.user.findUnique({
      where: {
        id: decode.id
      }
    });
    if (!user || user.refreshToken != refreshToken)
      return -1;
    const newAccessToken = jwt.sign({
      id: user.id,
      name: user.name,
      email: user.email,
    }, config.access_secret, {
      expiresIn: "15m"
    })
    return newAccessToken;

  } catch (err) {
    return 0
  }
}