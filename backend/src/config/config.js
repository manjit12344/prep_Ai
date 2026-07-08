import dotenv from "dotenv";
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

dotenv.config();

// prisma configration

export const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
})

export const myCookieAcc = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 1000*60*15
};
export const myCookieRef = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 1000*60*60*24*7

}


//Environment variables configration

const config = {

    database_url: process.env.DATABASE_URL,
    openrouter_api_key:process.env.OPENROUTER_API_KEY,
    gemini_api_key: process.env.GEMINI_API_KEY,
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    redirect_url: process.env.REDIRECT_URL,
    access_secret:process.env.ACCESS_SECRET,
    refresh_secret:process.env.REFRESH_SECRET,
    resume_ats:process.env.RESUME_ATS,
    analysis:process.env.ANALYSIS,
    nodeEnv:process.env.NODE_ENV,

    port: process.env.PORT
}

export default config;
