import { OpenRouter } from "@openrouter/sdk";
import config, { prisma } from "../config/config.js";

const openrouter = new OpenRouter({
    apiKey: config.openrouter_api_key
});

async function analysis(payload) {
    const stream = await openrouter.chat.send({
        chatRequest: {
            model: "google/gemma-4-31b-instruct:free",
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
    const data = await prisma.interviewResponse.findMany({
        where: {
            interviewId
        }, orderBy: {
            id: "asc"
        }, select: {
            question: true,
            answer: true,
            score: true,
        }
    })
    let payload = [];
    data.forEach(e => {
        let obj = {
            question: e.question
            , answer: e.answer
            , score: e.score
        }
        payload.push(obj);
    })


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