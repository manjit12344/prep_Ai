import config, { prisma } from "../config/config.js";
import { setPre, joinDetails, handelFirst, findFromDb, storeInDb } from "../services/02.userDb.service.js";
import { runNow, first } from "../services/03.gemini.service.js"
import {owlAlphaPayload} from "../services/06.analysis.service.js";

export async function preInterview(req, res) {
    const { type, level, company } = req.body;
    const userId = req.user.id;

    const storeInto = await setPre(userId, type, level, company);

    return res.json({
        response: storeInto
    })
}

export async function interviewResponse(req, res) {
    const { id, qId, userResponse } = req.body;  //interviewId
    const sanitizedResponse = userResponse
        ? userResponse.replace(/\r?\n|\r/g, " ").replace(/"/g, "'")
        : "";
    const nId = Number(id);
    const nqId = Number(qId) || null;
    const flag = await prisma.interviewResponse.findFirst({
        where: { interviewId: nId }
    })

    const details = await joinDetails(nId);

    const type = details.type;
    const level = details.level;
    const company = details.company;

    let aiChat = null;
    try {
        if (!flag) {   //first time starting interview!!
            const preDefined = "start the interview sir";

            const preHistory = [
                { role: "model", parts: [{ text: "Hello! Thank you for joining today. Are you ready to begin the interview?" }] },
            ]

            //sending my response to ai...
            aiChat = await first(nId,preHistory, preDefined, type, level, company);

            const rightResponse = await handelFirst(nId, aiChat);
            return res.json({
                interviewId: nId,
                id: rightResponse,
                Question: aiChat.nextQuestion
            })
        }

        const history = await findFromDb(nId);  //make current questions history that what ai asked
        aiChat = await runNow(nId,history, sanitizedResponse, type, level, company);

        console.log("AI CHAT:");
        console.dir(aiChat, { depth: null });//sending to ai and got response
        const store = await storeInDb(nqId, nId, aiChat, userResponse);

        //brillient edge case !good job
        // do analysis on ending interview bro!
        let analysis = null;
        if (aiChat.isInterviewComplete) {
            await prisma.interview.update({
                where: {
                    id: nId
                },
                data: {
                    status: "completed"
                }
            })
          analysis = await owlAlphaPayload(nId,req.user.id);
        }
        return res.json({
            interviewId: nId,
            qId: store,
            aiChat,
            analysis
        })
    }
    catch (err) {
        res.json({ message: "Something wend wrong",
            error:err
        })
    }
}

// [
// { role: "user", parts: [{ text: "Hello" }] },
//   { role: "model", parts: [{ text: "Hi, let's start!" }] }
// ]

