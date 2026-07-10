import { GoogleGenAI, Type } from "@google/genai";
import config, { prisma } from "../config/config.js";
import { PDFParse } from 'pdf-parse';
import { rotate2 } from "../utilities/keyRotation.js"




const gemini_response = {
  type: Type.OBJECT,
  properties: {
    atsScore: {
      type: Type.NUMBER,

    },
    strengths: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING,
         description:"return null if formate of text is wrong"
      },
    },
    weaknesses: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING,
        description:"return null if formate of text is wrong"
      },
    },
    suggestions: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING,
         description:"return null if formate of text is wrong"
      },
    },
  },
  required: [
    "atsScore",
    "strengths",
    "weaknesses",
    "suggestions",
  ],
};


function aiConfig() {
  return {
    model: "gemini-2.5-flash",
    config: {
      systemInstruction: `You are an expert ATS scanner and technical recruiter.

          Return ONLY valid JSON.

                {
          "atsScore": number,
          "strengths": [],
          "weaknesses": [],
          "suggestions": []
        }

        `,

      responseMimeType: "application/json",
      responseSchema: gemini_response,
    }
  };
}


export async function main(url) {


  const parser = new PDFParse({ url: url });
  const content = await parser.getText();

  console.log(content);



  const chat = rotate2().chats.create(aiConfig());
  try {
    let sendMsg = await chat.sendMessage({ message: `this is my resume content: ${JSON.stringify(content)}` });
    console.log(sendMsg.text);
    return sendMsg.text;
  }
  catch (err) {
    console.error("first() failed — Gemini call or JSON parse error:", err);
    main(url) // don't hide it, let the controller's catch report a proper error
  }
} 