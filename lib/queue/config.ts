import IORedis from "ioredis";

const redisUrl = process.env.REDIS_URL;

export const connection = redisUrl
  ? new IORedis(redisUrl, {
      lazyConnect: true,
      maxRetriesPerRequest: null,
      retryStrategy: () => null,
    })
  : undefined;

export const GENERATION_QUEUE = "image-generation";
