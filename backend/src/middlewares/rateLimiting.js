import rateLimit from "express-rate-limit";

export const aiLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10,
    message: {
        success: false,
        message: "Too many requests. Please try again later."
    }
});

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: {
        success: false,
        message: "Too many login attempts."
    }
});

export const resumeLimiter = rateLimit({
    windowMs: 2 * 60 * 1000,
    max: 1,
    message: {
        success: false,
        message: "Too many attempts."
    }
})