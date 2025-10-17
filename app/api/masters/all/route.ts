// app/api/masters/all/route.ts
export const dynamic = 'force-dynamic';

import { redis, GEO_KEY, META_KEY } from '../../../../lib/redis';

/**
 * Нормализуем любую форму ответа geopos к {lon, lat}
 */
function normalizePos(x: any): { lon: number; lat: number } | null {
  if (!x) return null;

  // Вариант 1: кортеж [lon, lat]
  if (Array.isArray(x) && x.length >= 2) {
    const lon = Number(x[0]);
    const lat = Number(x[1]);
    if (Number.isFinite(lon) && Number.isFinite(lat)) return { lon, lat };
    return null;
  }

  // Вариант 2: объект {lng, lat} / {lon, lat} / {longitude, latitude}
  if (typeof x === 'object') {
    const lon =
      Number((x as any).lon ??
             (x as any).lng ??
             (x as any).longitude ??
             (x as any)[0]);
    const lat =
      Number((x as any).lat ??
             (x as any).latitude ??
             (x as any)[1]);

    if (Number.isFinite(lon) && Number.isFinite(lat)) return { lon, lat };
    return null;
  }

  return null;
}

export async function GET(_req: Request) {
  try {
    // 1) список id в GEO-индексе
    const members = (await redis.zrange(GEO_KEY, 0, -1)) as string[];

    if (!members || members.length === 0) {
      return Response.json([], { headers: { 'Cache-Control': 'no-store' } });
    }

    // 2) координаты — типизируем как any и приводим вручную (SDK разные)
    const rawPositions: any[] = (await (redis as any).geopos(
      GEO_KEY,
      ...members
    )) as any[];

    // 3) метаданные пачкой
    const metaKeys = members.map((id) => META_KEY(id));
    const metasRaw = (await redis.mget(...metaKeys)) as (string | null)[];

    // 4) собираем ответ
    const data = members
      .map((id, i) => {
        const norm = normalizePos(rawPositions?.[i]);
        if (!norm) return null;

        let meta: any = null;
        const raw = metasRaw?.[i];
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
          lat: norm.lat,
          lon: norm.lon,
          updatedAt: meta?.updatedAt ?? null,
        };
      })
      .filter(Boolean);

    return Response.json(data, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    // безопасный фоллбек, чтобы ничего не падало
    return Response.json([], { headers: { 'Cache-Control': 'no-store' } });
  }
}
