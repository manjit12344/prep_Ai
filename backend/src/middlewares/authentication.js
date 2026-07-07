import jwt from "jsonwebtoken";
import config, { prisma, myCookieRef, myCookieAcc } from "../config/config.js"
import { newToken } from "../services/01auth.service.js"

export function verifyRef(req, res, next) {
  const token = req.cookies.refreshToken;
  
  if (!token) {
    return res.status(401).json({
      message: "Refresh token missing",
    });
  }
  try {
    const decoded = jwt.verify(token, config.refresh_secret);

    req.refToken = token;
    next();
  }
  catch (err) {
    console.log(err.name);
    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");
    return res.sendStatus(401);
  }
}

export async function verifyAcc(req, res, next) {
  let token = req.cookies.accessToken;
  let refToken = req.cookies.refreshToken;
  if (!token && refToken) {
    token = await newToken(refToken);
    if (!token || token === -1 || token === 0) {
      return res.sendStatus(403);
    }
    res.cookie("accessToken", token, myCookieAcc);
  }
  if (!token && !refToken) {
    return res.sendStatus(401);
  }
  try {
    const decoded = jwt.verify(token, config.access_secret);
    req.user = decoded;
    req.token = token;
    return next();
  } catch (err) {
    if (err.name == "TokenExpiredError") {
      console.log(err.name,err);
      const newAccessToken = await newToken(refToken);
      if (!newAccessToken || newAccessToken === -1 || newAccessToken === 0) return res.sendStatus(403);
      res.clearCookie("accessToken");
      res.cookie("accessToken", newAccessToken, myCookieAcc)
      const decoded = jwt.verify(newAccessToken, config.access_secret);
      req.user = decoded;
      req.token = newAccessToken;
      req.acc = newAccessToken;
      req.ref = refToken;
      return next();
    }
    res.sendStatus(401)
  }
}