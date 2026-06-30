import "../services/01auth.service.js"

import passport from "passport";
import jwt from "jsonwebtoken";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import config, { prisma,myCookieAcc,myCookieRef } from "../config/config.js"

export async function callBack(req, res) {
    const user = req.user;

    //create accessToken
    const accessToken = jwt.sign({
        id: user.id,
        name: user.name,
        email: user.email
    }, config.access_secret, {
        expiresIn: "15m"
    });

    //create refreshToken

    const refreshToken = jwt.sign({
        id: user.id
    }, config.refresh_secret, {
        expiresIn: "7d"
    });

    await prisma.user.update({
        where: {
            id: user.id
        },
        data: {
            refreshToken
        }

    })
    // storing refreshToken in cookies
    res.cookie("refreshToken", refreshToken, myCookieRef);

    res.cookie("accessToken", accessToken,myCookieAcc);
    
    res.redirect("https://prep-ai-aztu.onrender.com/features")
}

// brotha veri importaant 
export async function knowMe(req,res){
    if(req.user) return res.json({
        user:req.user
    })
    return res.json({
        user:null
    })
    
}

export async function logOut(req,res){
      const findFrom = await prisma.user.update({
        where:{
            id:req.user.id
        },
        data:{
            refreshToken:null
        }
      });
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      res.json({
        message:`user ${req.user.name} log out`
      })
}