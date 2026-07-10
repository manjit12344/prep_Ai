import { GoogleGenAI, Type } from "@google/genai";
import config, { prisma } from "../config/config.js";
import {findFromDb} from "./02.userDb.service.js";
import { rotate3 } from "../utilities/keyRotation.js"

const ai = new GoogleGenAI({ apiKey: config.resume_ats });
const gemini_response = {
    type: Type.OBJECT,
    properties: {
        averageScore: {
            type: Type.NUMBER,
            description: "Overall interview score out of 100.",
        },
        technicalScore: {
            type: Type.NUMBER,
            description: "Technical knowledge score out of 100.",
        },
        communicationScore: {
            type: Type.NUMBER,
            description: "Communication skills score out of 100.",
        },
        speedScore: {
            type: Type.NUMBER,
            description: "Response speed score out of 100.",
        },
        weakness: {
            type: Type.STRING,
            description: "Primary weakness identified during the interview.",
        },
        strength: {
            type: Type.STRING,
            description: "Primary strength identified during the interview.",
        },
        feedback: {
            type: Type.STRING,
            description: "Overall feedback and suggestions for improvement.",
        },
    },
    required: [
        "averageScore",
        "technicalScore",
        "communicationScore",
        "speedScore",
        "weakness",
        "strength",
        "feedback",
    ],
};

async function analysis(payload) {
    const chat = rotate3().chats.create(
        {
            model: "gemini-2.5-flash",
            history:payload,
            config: {
                systemInstruction: `You are an expert interview analyst.
                give honest analysis of the whole interview.

        `,
                responseMimeType: "application/json",
                responseSchema: gemini_response,
            }
        }
    );

    let sendMsg = await chat.sendMessage({ message: `give me honest analysis of my interview` });
    console.log(sendMsg.text);
    return sendMsg.text;
}

export async function owlAlphaPayload(interviewId, userId) {

    const payload = await findFromDb(interviewId);

    let response = await analysis(payload)
    let cleaner = response.replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        // 2. Remove trailing markdown fences
        .replace(/\s*```$/, "")
        // 3. Trim edge whitespaces and replace tricky escaped linebreaks
        .trim();
    let viewSome = JSON.parse(cleaner);
    try {
        const data = await prisma.interviewResult.findFirst({
            where: {
                interviewId,
                userId
            }
        })
        if (data) return data;
        await prisma.interviewResult.create({
            data: {
                interviewId,
                userId,
                averageScore: viewSome.averageScore,
                technicalScore: viewSome.technicalScore,
                communicationScore: viewSome.communicationScore,
                speedScore: viewSome.speedScore,
                weakness: viewSome.weakness,
                strength: viewSome.strength,
                feedback: viewSome.feedback,



            }

        })
        return viewSome;
    } catch (error) {
        console.log(error);
        owlAlphaPayload(interviewId, userId)
    }
}
export async function analytics(interviewId, userId) {
    const data = await prisma.interviewResult.findFirst({
        where: {
            interviewId,
            userId
        }, select: {
            averageScore: true,
            technicalScore: true,
            communicationScore: true,
            speedScore: true,
            weakness: true,
            strength: true,
            feedback: true
        }
    })
    return data;
}