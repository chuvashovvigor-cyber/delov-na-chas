// lib/redis.ts
import { Redis } from '@upstash/redis';

export const redis = Redis.fromEnv();

// ключи/настройки для геолокации мастеров
export const GEO_KEY = 'masters:geo';
export const META_KEY = (id: string) => `master:${id}`;

// TTL геопозиции мастера (секунды)
export const MASTER_LOCATION_TTL =
  parseInt(process.env.MASTER_LOCATION_TTL ?? '180', 10); // 3 минуты

export const MASTER_TTL_SEC = MASTER_LOCATION_TTL;
