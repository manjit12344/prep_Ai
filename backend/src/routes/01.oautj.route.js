import express from "express";
import passport from "passport";
import config from "../config/config.js";
import {verifyRef,verifyAcc} from "../middlewares/authentication.js"
import * as authControllers from "../controllers/01.oauth.controller.js";
import {authLimiter} from "../middlewares/rateLimiting.js";

const router = express.Router();

router.get("/auth/google",authLimiter,passport.authenticate("google",{scope:["profile","email"],  prompt: "consent",}));

router.get("/auth/google/callback",authLimiter,passport.authenticate("google", { session: false }),authControllers.callBack);

router.get("/knowMe",verifyAcc,authControllers.knowMe);
router.get("/logOut",authLimiter,verifyRef,verifyAcc,authControllers.logOut);
export default router;
