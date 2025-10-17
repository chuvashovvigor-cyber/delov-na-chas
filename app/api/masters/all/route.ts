// app/api/masters/all/route.ts
import { redis, GEO_KEY, META_KEY } from '../../../../lib/redis';

export const dynamic = 'force-dynamic';

export async function GET() {
  // 1) получаем список id из GEO-индекса
  const members = await redis.zrange<string>(GEO_KEY, 0, -1);
  if (!members.length) return Response.json([]);

  // 2) позиции (lat, lon) для всех сразу
  const positions = await redis.geopos(GEO_KEY, ...members); // [[lon,lat], ...]
  // 3) мета в mget (имя, обновлено и т.п.)
  const metaKeys = members.map((id) => META_KEY(id));
  const metas = await redis.mget<(string | null)[]>(...metaKeys);

  const data = members.map((id, i) => {
    const pos = positions[i];
    const metaRaw = metas[i] ? JSON.parse(metas[i] as string) : null;
    const [lon, lat] = pos ?? [null, null];
    return { id, lat, lon, name: metaRaw?.name ?? `Мастер ${id}`, updatedAt: metaRaw?.updatedAt ?? null };
  }).filter(x => x.lat && x.lon);

  return Response.json(data, { headers: { 'Cache-Control': 'no-store' } });
}
