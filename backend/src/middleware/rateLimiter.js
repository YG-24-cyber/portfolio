import rateLimit from 'express-rate-limit';

export const contactRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: {
        message: 'Too many contact inquiries from this network. Please wait 15 minutes before submitting again.',
        code: 'RATE_LIMIT_EXCEEDED',
      },
    });
  },
});
