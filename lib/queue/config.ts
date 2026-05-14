import IORedis from "ioredis";

const redisUrl = process.env.REDIS_URL;

export const connection = redisUrl
  ? new IORedis(redisUrl, { maxRetriesPerRequest: null })
  : undefined;

export const GENERATION_QUEUE = "image-generation";
