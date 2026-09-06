const redisClient = require("../config/redis");

// Sliding window configuration
const WINDOW_SIZE_IN_SECONDS = 30;
const MAX_REQUESTS_PER_WINDOW = 10;

// In-memory fallback map if Redis is temporarily unreachable
const inMemoryStore = new Map();

const ratelimiter = async (req, res, next) => {
  try {
    const identifier = req.result ? String(req.result._id) : (req.ip || "guest");
    const key = `ratelimit:${identifier}`;
    const currentTime = Date.now() / 1000;
    const windowStart = currentTime - WINDOW_SIZE_IN_SECONDS;

    // Try Redis sliding-window first
    if (redisClient && redisClient.isOpen) {
      await redisClient.zRemRangeByScore(key, 0, windowStart);
      const requestCount = await redisClient.zCard(key);

      if (requestCount >= MAX_REQUESTS_PER_WINDOW) {
        return res.status(429).json({
          message: `Too many submissions. Please wait ${WINDOW_SIZE_IN_SECONDS} seconds before trying again.`
        });
      }

      await redisClient.zAdd(key, [{ score: currentTime, value: `${currentTime}:${Math.random()}` }]);
      await redisClient.expire(key, WINDOW_SIZE_IN_SECONDS);
      return next();
    }

    // In-memory sliding-window fallback
    if (!inMemoryStore.has(identifier)) {
      inMemoryStore.set(identifier, []);
    }
    const timestamps = inMemoryStore.get(identifier).filter(t => t > windowStart);
    if (timestamps.length >= MAX_REQUESTS_PER_WINDOW) {
      return res.status(429).json({
        message: `Too many submissions. Please wait ${WINDOW_SIZE_IN_SECONDS} seconds before trying again.`
      });
    }
    timestamps.push(currentTime);
    inMemoryStore.set(identifier, timestamps);
    return next();

  } catch (err) {
    console.error("Rate Limiter Warning:", err.message);
    // Fail-open on rate limiter internal errors so legitimate users aren't blocked
    next();
  }
};

module.exports = ratelimiter;
