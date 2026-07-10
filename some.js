import { GoogleGenAI } from '@google/genai';
import dotenv from "dotenv";
dotenv.config();

// Initialize the new client (it automatically picks up process.env.GEMINI_API_KEY)
const ai = new GoogleGenAI({ apiKey: process.env.key20}); 

export const runNow = async (prompt) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite', // <-- THIS is the modern, highly available model ID
      contents: prompt,
    });
    console.log(response.text);
    return response.text;
  } catch (error) {
    console.error("Gemini Helper Error:", error);
    throw error;
  }
};
runNow("why stars twinkel")
console.log(runNow("why sky is blue"))