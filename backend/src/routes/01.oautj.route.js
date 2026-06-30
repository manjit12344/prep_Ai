import express from "express";
import passport from "passport";
import config from "../config/config.js";
import {verifyRef,verifyAcc} from "../middlewares/authentication.js"
import * as authControllers from "../controllers/01.oauth.controller.js";

const router = express.Router();

router.get("/auth/google",passport.authenticate("google",{scope:["profile","email"],  prompt: "consent",}));

router.get("/auth/google/callback",passport.authenticate("google", { session: false }),authControllers.callBack);
router.get("/auth",verifyRef,verifyAcc,(req,res)=>{
    res.send("authorized")
})
router.get("/knowMe",verifyAcc,authControllers.knowMe);
router.get("/logOut",verifyRef,verifyAcc,authControllers.logOut);
router.get("/debug", (req, res) => {
  res.json({
    cookies: req.cookies,
    access: req.cookies.accessToken,
    refresh: req.cookies.refreshToken,
    accessSecretExists: !!config.access_secret,
    refreshSecretExists: !!config.refresh_secret,
  });
});


export default router;