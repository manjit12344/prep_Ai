import { GoogleGenAI, Type } from "@google/genai";
import config, { prisma } from "../config/config.js";
import { rotate } from "../utilities/keyRotation.js";

function aiConfig(history, userResponse, type, level, company, payload) {
  return {
    model: "gemini-2.5-flash",
    contents: [...history,
    {
      role: "user",
      parts: [{ text: userResponse }]
    }],
    config: {
      systemInstruction: `You are a realistic ${level}-level ${type} interviewer for ${company}.

Rules:
- Ask practical interview questions, not textbook definitions.
- Be conversational; avoid repeating praise.
- Evaluate the candidate answer and score 1-10.
- Strong answers should usually get deeper follow-ups about trade-offs, edge cases, scalability, or "why" decisions.
- Weak answers should get clarifying follow-ups.
- Do not repeat completed MAIN topics:
${JSON.stringify(payload.topics)}

State:
Main completed: ${payload.mainQuestions}/5
Followups completed: ${payload.followupQuestions}

Choose:
- target="followup" when the current topic needs more exploration.
- target="main" when moving to a new topic.

End naturally after the interview is complete.

Return JSON only.`,

      responseMimeType: "application/json",
      responseSchema: gemini_response,
    }
  };
}

// Defining the schema format
const gemini_response = {
  type: Type.OBJECT,
  properties: {
    score: {
      type: Type.INTEGER,
      description: "Score out of 10 for the user's previous answer. Return 0 for the first question."
    },
    followup: {
      type: Type.STRING,
      description: "A brief 1-sentence note detailing what sub-topic needs tracking based on their weak score. Keep this short."
    },
    topic: {
      type: Type.STRING,
      description: "just a topic asked in the next question",
    },
    target: {
      type: Type.STRING,
      description: "tell if the next question is main or followup. return only 'main' or 'followup' "
    },
    nextQuestion: {
      type: Type.STRING,
      description: "The text to show to the user. If their last score was between 4 and 6, this MUST be a simpler follow-up question. Otherwise, it MUST be the next major technical topic question."
    },
    isInterviewComplete: {
      type: Type.BOOLEAN,
      description: "Set to true ONLY after 5 MAJOR technical topic questions have been fully answered. Ignore simpler follow-up questions when counting."
    }
  },
  required: ["score", "followup", "nextQuestion", "topic", "target", "isInterviewComplete"],
};
function makeShort(history) {
  if (history.length >= 2) {
    return [history[history.length - 2], history[history.length - 1]];
  }
  return history;
}

async function target(interviewId) {
  const data = await prisma.interviewResponse.findMany({
    where: {
      interviewId,
    }, select: {
      target: true,
      topic: true,
      answer: true,
    }
  })
  let cntMain = 0, cntFollowup = 0, topics = [];
  for (const key in data) {
    if (data[key].answer === null) continue;
    if (data[key].target === "main") cntMain++;
    else if (data[key].target === "followup") cntFollowup++;
    topics.push({ [data[key].topic]: data[key].target });
  }
  let cntmain = 0;
  let cntfollow = 0;
  for (let i = 0; i < topics.length; i++) {
    for (const key in topics[i]) {
      if (topics[i][key] === "main") cntmain++;
    }
    if (cntmain === 5) {
      for (let j = i; j < topics.length; j++) {
        for (const key in topics[j]) {
          if (topics[j][key] === "followup") cntfollow++;
        }
      }
      break;
    }
  }

  return {
    mainQuestions: Number(cntMain),
    followupQuestions: Number(cntFollowup),
    topics: topics,
    mainLast: cntmain,
    followupLast: cntfollow
  }
}

export async function first(id, history, preDefined, type, level, company) {
  const myPayload = {
    mainQuestions: 0,
    followupQuestions: 0,
    topics: null
  }
  const response = await rotate().models.generateContent(aiConfig(makeShort(history), preDefined, type, level, company, myPayload));

  try {
    return JSON.parse(response.text);
  }
  catch (err) {
    console.error("first() failed — Gemini call or JSON parse error:", err);
    throw err; // don't hide it, let the controller's catch report a proper error
  }
}


export async function runNow(id, history, userResponse, type, level, company) {

  const myPayload = await target(id)
  if (myPayload.mainQuestions >= 5 && myPayload.followupLast >= 4) {
    return {
      score: 0,
      followup: null,
      topic: null,
      target: null,
      nextQuestion: "Thank you for interviewing with us. The interview is now complete.",
      isInterviewComplete: true
    }
  }

  try {
    const shortHist = makeShort(history);
    const response = await rotate().models.generateContent(aiConfig(shortHist, userResponse, type, level, company, myPayload));
    console.log(JSON.parse(response.text))
    return JSON.parse(response.text);

  } catch (error) {
    console.error("Execution Error:", error);
    return {
      score: 0,
      followup: null,
      topic: null,
      target: null,
      nextQuestion: null,
      isInterviewComplete: true
    }
  }
}
