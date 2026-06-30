import { GoogleGenAI, Type } from "@google/genai";
import config, { prisma } from "../config/config.js";

const ai = new GoogleGenAI({ apiKey: config.gemini_api_key });

function aiConfig(history, type, level, company) {
  return {
    model: "gemini-2.5-flash",
    history: history,
    config: {
      systemInstruction: `You are a professional technical interviewer assessing a ${type} candidate at an ${level} level for ${company}.
      
      CORE RULES:
      1. Your goal is to cover exactly 5 MAJOR technical topics/questions.
      2. Review the provided chat history. Count how many MAJOR questions have been asked and answered so far. Do NOT count simpler troubleshooting/follow-up questions toward the 5-question limit.
      3. CRITICAL: If the user's score on their last answer is between 4 and 6 (inclusive), do NOT move to a new topic. Instead, use the 'nextQuestion' field to ask a simpler follow-up question related to that specific topic to test their basic understanding.
      4. If the user scored 7 or higher, or 3 and below, move to the next major technical topic.
      5. Once exactly 5 MAJOR technical topics have been fully answered (excluding your follow-up questions), set 'isInterviewComplete' to true and say goodbye smoothly.
      6. Behaive like a recuiter who is hiring a candidate having ${type} skills of ${level} level and for ${company}`,

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
    feedback: {
      type: Type.STRING,
      description: "Brief evaluation of the user's answer. Return null for the first question."
    },
    followup: {
      type: Type.STRING,
      description: "A brief 1-sentence note detailing what sub-topic needs tracking based on their weak score. Keep this short."
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
  required: ["score", "feedback", "followup", "nextQuestion", "isInterviewComplete"],
};
function makeShort(history) {
  if (history.length >= 2) {
    return [history[history.length - 2], history[history.length - 1]];
  }
  return history;
}
export async function first(history, preDefined, type, level, company) {

  const chat = ai.chats.create(aiConfig(history, type, level, company));

  try {
    let sendMsg = await chat.sendMessage({ message: preDefined });

    return JSON.parse(sendMsg.text);
  }
  catch (err) {
    return {
      score: 0,
      feedback: null,
      followup: null,
      nextQuestion: null,
      isInterviewComplete: false
    }
  }
}


export async function runNow(history, userResponse, type, level, company) {
  try {
    const shortHist = makeShort(history);
    const chat = ai.chats.create(aiConfig(history, type, level, company));
    let sendMsg = await chat.sendMessage({ message: userResponse });
    console.log(JSON.parse(sendMsg.text))
    let response = JSON.parse(sendMsg.text);
    return response;

  } catch (error) {
    console.error("Execution Error:", error);
    return {
      score: 0,
      feedback: null,
      followup: null,
      nextQuestion: null,
      isInterviewComplete: true
    }
  }
}

