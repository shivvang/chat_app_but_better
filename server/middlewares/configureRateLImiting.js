import rateLimit from "express-rate-limit";

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit  100 requests
  message: "Too many requests for now, please try again later.",
});

export const messageLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 50, // Limit to 50 requests
  message: "Too many messages , please try again later.",
});

export const userLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 20, // limit 20 users for time being
  message: "Too many user on board , please try again later.",
});
