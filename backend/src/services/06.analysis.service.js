import { OpenRouter } from "@openrouter/sdk";
import config, { prisma } from "../config/config.js";

const openrouter = new OpenRouter({
    apiKey: config.openrouter_api_key
});

async function analysis(payload) {
    const stream = await openrouter.chat.send({
        chatRequest: {
            model: "qwen/qwen3-32b:free",
            response_format: { type: "json_object" },
            stream: false,

            messages: [
                {
                    "role": "user",
                    "content": [
                        {
                            type: "text",
                            text: `You are an expert analyser who analysis the interview by reading conversation.

               Return ONLY valid JSON.

                {
                 "averageScore": number,
                 "technicalScore": number,
                 "communicationScore": number,
                 "speedScore": number,
                 "weakness": string,
                 "strength": string,
                 "feedback": string,
               } 
                 give these scores out of 100
                 following is the text
        `
                        },
                        {
                            type: "text",
                            text: `full interview detail: ${JSON.stringify(payload)}`
                        }
                    ]
                }
            ],
        }
    });
    console.log(stream.choices[0]?.message?.content);

   return stream.choices[0]?.message?.content;
}

export async function owlAlphaPayload(interviewId, userId) {
    try {
        const data = await prisma.interviewResult.findFirst({
            where: { interviewId, userId }
        });
        if (data) return data;

        const dbRows = await prisma.interviewResponse.findMany({
            where: { interviewId },
            orderBy: { id: "asc" },
            select: { question: true, answer: true, score: true },
        });

        const payload = dbRows.map(e => ({
            question: e.question,
            answer: e.answer,
            score: e.score
        }));

        const response = await analysis(payload);

        if (!response) {
            console.error("AI analysis returned empty response");
            return null;
        }

        const cleaner = response
            .replace(/^```json\s*/i, "")
            .replace(/^```\s*/i, "")
            .replace(/\s*```$/, "")
            .trim();

        let viewSome;
        try {
            viewSome = JSON.parse(cleaner);
        } catch (parseErr) {
            console.error("Failed to parse AI JSON:", cleaner);
            return null;
        }

        const created = await prisma.interviewResult.create({
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
        });

        return created;
    } catch (error) {
        console.error("owlAlphaPayload error:", error);
        return null;
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