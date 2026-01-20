const rateLimit = require("express-rate-limit");


/**
 * This file is meant for putting rate limits on the amount of API calls that can be made
 * for expensive or critical security API's.
 */

// Rate limiting function for OpenAI chatbot API.
const chatRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20,            // 20 requests per minute per IP
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  chatRateLimiter,
};
