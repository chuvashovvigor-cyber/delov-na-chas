// app/api/masters/all/route.ts
export const dynamic = 'force-dynamic';

import { redis, GEO_KEY, META_KEY } from '../../../../lib/redis';

export async function GET(_req: Request) {
  try {
    // 1) список участников GEO-индекса
    const members = (await redis.zrange(GEO_KEY, 0, -1)) as string[];
    if (!members || members.length === 0) {
      return Response.json([], { headers: { 'Cache-Control': 'no-store' } });
    }

    // 2) координаты всех мастеров (Upstash возвращает [lon, lat] строками)
    const positions = (await redis.geopos(GEO_KEY, ...members)) as (
      | [number | string, number | string]
      | null
    )[];

    // 3) метаданные пачкой
    const metaKeys = members.map((id) => META_KEY(id));
    const metasRaw = (await redis.mget(...metaKeys)) as (string | null)[];

    // 4) сбор удобного ответа
    const data = members
      .map((id, i) => {
        const pos = positions[i];
        if (!pos) return null;

        let [lon, lat] = pos;
        const lonNum = typeof lon === 'string' ? parseFloat(lon) : (lon as number);
        const latNum = typeof lat === 'string' ? parseFloat(lat) : (lat as number);
        if (!Number.isFinite(lonNum) || !Number.isFinite(latNum)) return null;

        let meta: any = null;
        const raw = metasRaw[i];
        if (raw) {
          try {
            meta = JSON.parse(raw);
          } catch {
            meta = null;
          }
        }

        return {
          id,
          name: meta?.name ?? `Мастер ${id}`,
          lat: latNum,
          lon: lonNum,
          updatedAt: meta?.updatedAt ?? null,
        };
      })
      .filter(Boolean);

    return Response.json(data, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    // на всякий случай не роняем сборку/страницу
    return Response.json([], { headers: { 'Cache-Control': 'no-store' } });
  }
}
