import Redis from "ioredis";

type RedisLike = {
  incr(key: string): Promise<number>;
  expire(key: string, seconds: number): Promise<number>;
  ttl(key: string): Promise<number>;
};

type MemoryEntry = {
  value: number;
  expiresAt?: number;
};

class MemoryRedis implements RedisLike {
  private store = new Map<string, MemoryEntry>();

  async incr(key: string) {
    const entry = this.getEntry(key);
    entry.value += 1;
    this.store.set(key, entry);
    return entry.value;
  }

  async expire(key: string, seconds: number) {
    const entry = this.getEntry(key);
    entry.expiresAt = Date.now() + seconds * 1000;
    this.store.set(key, entry);
    return 1;
  }

  async ttl(key: string) {
    const entry = this.store.get(key);
    if (!entry?.expiresAt) return -1;
    const remaining = Math.max(0, entry.expiresAt - Date.now());
    return Math.ceil(remaining / 1000);
  }

  private getEntry(key: string) {
    const existing = this.store.get(key);
    if (!existing) return { value: 0 };
    if (existing.expiresAt && existing.expiresAt <= Date.now()) {
      this.store.delete(key);
      return { value: 0 };
    }
    return existing;
  }
}

const redisUrl = process.env.REDIS_URL;
const globalForRedis = globalThis as unknown as { redis?: RedisLike };

export const redis: RedisLike =
  globalForRedis.redis ?? (redisUrl ? new Redis(redisUrl) : new MemoryRedis());

if (process.env.NODE_ENV !== "production") {
  globalForRedis.redis = redis;
}
