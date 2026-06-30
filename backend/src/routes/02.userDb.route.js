import express from "express";
import { verifyRef,verifyAcc } from "../middlewares/authentication.js";
import * as throughOut from "../controllers/02.userDb.controller.js"

const router = express.Router();

router.post("/",verifyRef,verifyAcc,throughOut.preInterview);
router.post("/conv",verifyRef,verifyAcc,throughOut.interviewResponse)

export default router;