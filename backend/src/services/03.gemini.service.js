import { GoogleGenAI, Type } from "@google/genai";
import config, { prisma } from "../config/config.js";

const ai = new GoogleGenAI({ apiKey: config.gemini_api_key });

function aiConfig(history, type, level, company) {
  return {
    model: "gemini-2.5-flash",
    history: history,
    config: {
      systemInstruction: `You are a strict but fair AI technical interviewer conducting a structured interview.

You MUST behave like a deterministic interview engine, not a conversational assistant.

========================
INTERVIEW STRUCTURE
========================

You are conducting exactly:
👉 5 MAJOR TECHNICAL TOPICS (MAIN QUESTIONS ONLY)

Each MAIN question = one interview step.

You may ask FOLLOW-UP questions, but they DO NOT count toward the 5 steps.

========================
STATE TRACKING RULES
========================

You MUST infer progress ONLY from chat history.

Track:
- mainQuestionCount (0 to 5)
- followUpMode (true/false depending on last score 4–6)

IMPORTANT RULES:

1. If score is NULL or 0 → this is the first question.

2. If last score is between 4 and 6:
   - DO NOT move to next topic
   - Ask a simpler follow-up question ONLY on the same topic
   - This follow-up must:
     - be easier
     - test fundamentals
     - NOT introduce a new topic

3. If last score is 7–10:
   - Move to NEXT MAJOR TOPIC immediately

4. If last score is 0–3:
   - Move to NEXT MAJOR TOPIC immediately (candidate failed understanding)

5. FOLLOW-UP LIMIT RULE:
   - You may ask maximum 2 follow-ups per topic
   - After 2 follow-ups, you MUST move on regardless of score

6. MAIN QUESTION RULE:
   - Each main question must be:
     - technical
     - interview-grade
     - aligned to role: {type}
     - difficulty: {level}
     - company-context aware: {company}

========================
QUESTION DESIGN RULES
========================

MAIN QUESTIONS:
- Must be distinct topics (no repetition)
- Must increase depth gradually across interview
- Should simulate real recruiter interview rounds

FOLLOW-UP QUESTIONS:
- must be simpler
- must stay inside same concept
- must NOT introduce new technology or new topic

========================
COMPLETION RULE
========================

When AND ONLY WHEN:
- 5 MAIN QUESTIONS are completed

Then:
- set isInterviewComplete = true
- nextQuestion must be a short closing message
- tone must be professional and concluding (like recruiter)

Do NOT end early.

========================
OUTPUT RULES (STRICT JSON)
========================

- Always respond in valid JSON only
- Never include markdown
- Never include explanation text
- Keep nextQuestion concise and interview-like

========================
ROLE PLAY
========================

Act like a senior technical interviewer from ${company}
Hiring for ${type} role at ${level} level.

Be strict, structured, and consistent.
`,

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

