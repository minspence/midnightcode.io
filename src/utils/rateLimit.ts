import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Shared across all serverless instances (state lives in Upstash Redis).
// Requires UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN.
const limiters = new Map<string, Ratelimit>();

function getLimiter(limit: number, intervalMs: number) {
  const id = `${limit}:${intervalMs}`;
  let limiter = limiters.get(id);

  if (!limiter) {
    limiter = new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(limit, `${intervalMs} ms`),
      prefix: `midnightcode:contact:${id}`,
      analytics: false,
    });
    limiters.set(id, limiter);
  }

  return limiter;
}

/**
 * Sliding-window rate limit per key (e.g. client IP).
 * Fails open: if Upstash is unreachable or misconfigured, the request is
 * allowed (and the error logged) so the contact form keeps working.
 */
export async function rateLimit(
  limit: number,
  intervalMs: number,
  key: string,
): Promise<{ allowed: boolean; retryAfterSeconds?: number }> {
  try {
    const { success, reset } = await getLimiter(limit, intervalMs).limit(key);

    return success
      ? { allowed: true }
      : {
          allowed: false,
          retryAfterSeconds: Math.max(1, Math.ceil((reset - Date.now()) / 1000)),
        };
  } catch (error) {
    console.error("[rateLimit] Upstash unavailable, allowing request:", error);
    return { allowed: true };
  }
}
