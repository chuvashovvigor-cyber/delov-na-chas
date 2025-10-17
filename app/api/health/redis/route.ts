// app/api/health/redis/route.ts
import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

export const dynamic = 'force-dynamic'; // чтобы ничего не пытались статически собирать

const redis = Redis.fromEnv();

export async function GET() {
  try {
    const key = 'health:ping';
    await redis.set(key, 'pong', { ex: 60 });
    const value = await redis.get<string>(key);
    return NextResponse.json({ ok: true, value });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? 'Redis error' },
      { status: 500 }
    );
  }
}
