import express from "express";
import { verifyRef,verifyAcc } from "../middlewares/authentication.js";
import * as throughOut from "../controllers/02.userDb.controller.js";
import {aiLimiter} from "../middlewares/rateLimiting.js";

const router = express.Router();

router.post("/",aiLimiter,verifyRef,verifyAcc,throughOut.preInterview);
router.post("/conv",aiLimiter,verifyRef,verifyAcc,throughOut.interviewResponse)

export default router;