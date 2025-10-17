// app/api/health/redis/route.ts
import { Redis } from "@upstash/redis";

export const dynamic = "force-dynamic"; // чтобы не кешировалось и работало на сервере каждый раз

const redis = Redis.fromEnv();

export async function GET() {
  try {
    // 1) ping
    const pong = await redis.ping();

    // 2) set/get c TTL (60 сек)
    const key = `test:${Date.now()}`;
    await redis.set(key, "ok", { ex: 60 });
    const value = await redis.get<string>(key);

    return Response.json({ ok: true, pong, key, value });
  } catch (err: any) {
    console.error("Upstash check failed:", err);
    return Response.json({ ok: false, error: err?.message ?? String(err) }, { status: 500 });
  }
}
