import rateLimit from "express-rate-limit";

export const limiter = rateLimit(
    {
        windowMs: 1000*60*15,
        max: 1000,
        message: {
            error: 'Too many requests, please try again after 15 minutes'
        }
    }
)