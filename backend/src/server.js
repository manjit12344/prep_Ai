import express from "express";
import passport from "passport";
import morgan from "morgan";
import  cors from "cors";
import cookieParser from "cookie-parser"
import config,{prisma} from "./config/config.js";
import path from "path"

import my_auth from "./routes/01.oautj.route.js";
import pre from "./routes/02.userDb.route.js";
import history from "./routes/03.history.route.js";
import resume from "./routes/04.resume.route.js";

const app = express();
const __dirname = path.resolve();

app.set("trust proxy", 1);
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://prep-ai-aztu.onrender.com"
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(passport.initialize());


app.use("/",my_auth);
app.use("/api/preInterview",pre);
app.use("/hist",history);
app.use("/resume",resume);

if(process.env.NODE_ENV==="production"){
  //serve our react app
  app.use(express.static(path.join(__dirname,"/frontend/dist")));
  app.get((req,res)=>{
    res.sendFile(path.resolve(__dirname,"frontend","dist","index.html"));
  })
}

app.listen(config.port,()=>console.log(`app is running on port ${config.port} `));

