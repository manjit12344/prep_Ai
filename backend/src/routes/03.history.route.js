import express from "express";
import { verifyRef,verifyAcc } from "../middlewares/authentication.js";
import * as hist from "../controllers/03.result.controller.js";

const router = express.Router();

router.get("/chat/:interviewId",verifyRef,verifyAcc,hist.seeChatHistory);
router.get("/allInterview",verifyRef,verifyAcc,hist.seeInterview);
router.get("/:interviewId/:userId",verifyRef,verifyAcc,hist.seeAnalytics);

export default router;

