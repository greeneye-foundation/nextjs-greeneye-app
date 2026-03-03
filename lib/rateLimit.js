// lib/rateLimit.js
// In-memory rate limiter using a sliding fixed-window strategy.
// Works for single-server deployments. For multi-instance/edge, use Redis (Upstash).

const store = new Map();

// Clean up expired entries every 5 minutes to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of store.entries()) {
    if (now > record.resetAt) store.delete(key);
  }
}, 5 * 60 * 1000);

/**
 * Returns a rate-limiter function to call at the top of an API handler.
 *
 * @param {object} options
 * @param {string} options.keyPrefix  - Unique name for this limiter (e.g. 'login')
 * @param {number} options.maxRequests - Max allowed requests per window
 * @param {number} options.windowMs   - Window duration in milliseconds
 *
 * @returns {(req, res) => boolean} Returns true if request is allowed, false (and sends 429) if blocked.
 *
 * Usage:
 *   const limiter = createRateLimiter({ keyPrefix: 'login', maxRequests: 10, windowMs: 15 * 60 * 1000 });
 *   export default function handler(req, res) {
 *     if (!limiter(req, res)) return;
 *     ...
 *   }
 */
export function createRateLimiter({ keyPrefix, maxRequests, windowMs }) {
  return function check(req, res) {
    const ip =
      (req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
      req.socket?.remoteAddress ||
      'unknown';

    const key = `${keyPrefix}:${ip}`;
    const now = Date.now();
    const record = store.get(key);

    if (!record || now > record.resetAt) {
      store.set(key, { count: 1, resetAt: now + windowMs });
      res.setHeader('X-RateLimit-Limit', String(maxRequests));
      res.setHeader('X-RateLimit-Remaining', String(maxRequests - 1));
      return true;
    }

    if (record.count >= maxRequests) {
      const retryAfterSec = Math.ceil((record.resetAt - now) / 1000);
      res.setHeader('Retry-After', String(retryAfterSec));
      res.setHeader('X-RateLimit-Limit', String(maxRequests));
      res.setHeader('X-RateLimit-Remaining', '0');
      res.status(429).json({
        message: `Too many requests. Please try again in ${Math.ceil(retryAfterSec / 60)} minute(s).`,
      });
      return false;
    }

    record.count++;
    res.setHeader('X-RateLimit-Limit', String(maxRequests));
    res.setHeader('X-RateLimit-Remaining', String(maxRequests - record.count));
    return true;
  };
}
