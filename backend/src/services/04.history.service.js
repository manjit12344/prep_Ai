import { ReplayResponse } from "@google/genai";
import config,{prisma} from "../config/config.js";

// x interview chat history
export async function checkout(userId,interviewId){
     const response = await prisma.interviewResponse.findMany({
        where:{
            interviewId,
        },
        orderBy:{
            id:"asc"
        },
        select:{
            question:true,
            answer:true,
            score:true,
            id:true,
            
        }
     });
     return response;
}

// x interview of x user

export async function checkout2(userId,flag){
    const response = await prisma.interview.findMany({
        where:{
            userId,
            status:flag?"completed":"going"
        },orderBy:{
            id:"desc"
        },
    })
    return response;
}