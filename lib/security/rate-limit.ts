import { AppError } from "@/lib/api/errors";
import { redis } from "@/lib/redis";

export async function rateLimit(
  key: string,
  limit: number,
  windowSeconds: number,
) {
  const redisKey = `rl:${key}`;
  const count = await redis.incr(redisKey);
  if (count === 1) {
    await redis.expire(redisKey, windowSeconds);
  }
  const ttl = await redis.ttl(redisKey);

  if (count > limit) {
    throw new AppError("RATE_LIMITED", "操作太频繁，请稍后再试", 429, {
      retryAfter: ttl,
    });
  }
}
