import config,{prisma} from "../config/config.js";
import {main} from "../services/05.deepseek.service.js"


export async function myResume(req, res, next) {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: "url missing" });
    }

    const response = await main(url);

    return res.status(200).json({
      response
    });

  } catch (err) {
    console.error("Resume controller error:", err);
    return res.status(500).json({
      error: "AI processing failed",
      details: err.message
    });
  }
}