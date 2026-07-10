import { GoogleGenAI, Type } from "@google/genai";
import config, { prisma } from "../config/config.js";
import { rotate } from "../utilities/keyRotation.js"
 
function aiConfig(history, type, level, company,payload) {
  return {
    model: "gemini-2.5-flash",
    history: history,
    config: {
      systemInstruction: `You are a realistic, senior-level interviewer conducting a technical interview for a ${level} ${type} role at ${company}. 

Your goal is to evaluate the candidate through practical, scenario-based questions, mimicking a real, high-quality interview.

### Current Interview State (Stateless Payload)
- Main topics completed: ${payload.mainQuestions}/5
- Current topic follow-ups completed: ${payload.followupQuestions}
- Historically completed topics (DO NOT REVISIT): ${JSON.stringify(payload.topics)}

### Interviewer Behavior Guidelines
1. **Be Conversational & Authentic:** Do not repeat praise (e.g., avoid "Great answer!", "Excellent point!"). Transition naturally based on their last response.
2. **Focus on Practicality:** Ask about real-world scenarios, architectural trade-offs, edge cases, scalability, and "why" decisions. Avoid textbook definitions.
3. **Determine the Next Step (Target):**
   - **followup**: If the candidate's answer was shallow, incorrect, or highly interesting, dig deeper into the *same* topic (trade-offs, edge cases, or clarifications).
   - **main**: If the candidate has sufficiently answered the current topic, or if ${payload.followupQuestions} >= 2, transition to a brand-new topic from the remaining interview scope.
4. **End Condition:** If ${payload.mainQuestions} >= 5, wrap up the interview gracefully, thank the candidate, and set isInterviewComplete to true.`,
 
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
    topic:{
      type: Type.STRING,
      description:"just a topic asked in the next question",
    },
    target:{
      type: Type.STRING,
      description:"tell if the next question is main or followup. return only 'main' or 'followup' "
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
  required: ["score","followup", "nextQuestion","topic","target", "isInterviewComplete"],
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
 
 
 
 
 
export async function first(id,history, preDefined, type, level, company) {
  const myPayload = {
    mainQuestions:0,
    followupQuestions:0,
    topics:null
  }
  const chat = rotate().chats.create(aiConfig(makeShort(history), type, level, company,myPayload));
 
  try {
    let sendMsg = await chat.sendMessage({ message: preDefined });
  
    return JSON.parse(sendMsg.text);
  }
  catch (err) {
    console.error("first() failed — Gemini call or JSON parse error:", err);
    return first(id,history, preDefined, type, level, company) // don't hide it, let the controller's catch report a proper error
  }
}
 
 
export async function runNow(id,history, userResponse, type, level, company){
 
  const myPayload = await target(id)
  if (myPayload.mainQuestions >= 5 && myPayload.followupQuestions>=25) {
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
    const chat = rotate().chats.create(aiConfig(shortHist, type, level, company,myPayload));
    let sendMsg = await chat.sendMessage({ message: userResponse });
    console.log(JSON.parse(sendMsg.text))
    let response = JSON.parse(sendMsg.text);
    
    //very importane edge case
    
    return response;
 
  } catch (error) {
    console.error("Execution Error:", error);
    return runNow(id,history, userResponse, type, level, company);
  }
}