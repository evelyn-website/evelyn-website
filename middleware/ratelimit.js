const rateLimit = require('express-rate-limit')

const globalRateLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 100,
    message: "You have exceeded your 100 requests per minute limit. Please slow down!",
    headers: true,
  });

  const normalCreateRateLimit = rateLimit({
    windowMs: 2 * 60 * 1000,
    max: 15,
    message: "You are trying to create too many entities",
    headers: true,
  });

  const extremeCreateRateLimit = rateLimit({
    windowMs: 10 * 1000,
    max: 5,
    message: "You are trying to create too many entities",
    headers: true,
  });

  const resetEmailRateLimit = rateLimit({
    windowMs: 2 * 60 * 1000,
    max: 1,
    message: "Please wait before sending another password reset email",
    headers: true,
  })

module.exports = { globalRateLimiter, normalCreateRateLimit, extremeCreateRateLimit, resetEmailRateLimit }