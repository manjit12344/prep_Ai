import config,{prisma} from "../config/config.js";
import {main} from "../services/05.deepseek.service.js"


export async function myResume(req,res,next){
   const {url} = req.body;
   if(!url) return res.json("url aint exist");
   const response = await main(url);
   res.json({
    response
   })
}