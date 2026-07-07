import express from "express";
import * as resum from "../controllers/04.resume.controller.js";
import { verifyRef,verifyAcc } from "../middlewares/authentication.js";
import {resumeLimiter} from "../middlewares/rateLimiting.js";


const router = express.Router();


router.post("/",resumeLimiter,resum.myResume);
export default router;