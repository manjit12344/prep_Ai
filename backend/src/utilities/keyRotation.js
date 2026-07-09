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
].filter(Boolean);

let resume = [
    process.env.key11,
    process.env.key12,
    process.env.key13,
    process.env.key14,
    process.env.key15
].filter(Boolean);

let analysis = [
    process.env.key16,
    process.env.key17,
    process.env.key18,
    process.env.key19,
    process.env.key20
].filter(Boolean);
let n = chat.length;
let x = resume.length;
let y = analysis.length;
let i = 0,j=0,k=0;

export function rotate(){
   const ai = new GoogleGenAI({ apiKey: chat[i%n] });
   i++;
   return ai;
}

export function rotate2(){
   const ai = new GoogleGenAI({ apiKey: resume[j%n] });
   j++;
   return ai;
}
export function rotate3(){
   const ai = new GoogleGenAI({ apiKey: analysis[k%n] });
   k++;
   return ai;
}

