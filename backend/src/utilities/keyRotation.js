import dotenv from "dotenv";
import { GoogleGenAI} from "@google/genai";

dotenv.config();

let chat = [
    process.env.key0,
    process.env.key1,
    process.env.key2,
    process.env.key3,
    process.env.key4,
    process.env.key5,
    process.env.key6,
    process.env.key7,
    process.env.key8,
    process.env.key9,
    process.env.key10,
    process.env.key11,
    process.env.key12,
    process.env.key13,
    process.env.key14,
    process.env.key15
].filter(Boolean);

let n = chat.length;
let i = 0;

export function rotate(){
   const ai = new GoogleGenAI({ apiKey: chat[i%n] });
   i++;
   return ai;
}