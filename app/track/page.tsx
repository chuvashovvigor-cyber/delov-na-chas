// app/track/page.tsx
'use client';

// чтобы не конфликтовать с export const dynamic ниже, импортируем под другим именем
import dynamicImport from 'next/dynamic';
import { useEffect, useMemo, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';

// —–––––––––––––  настройки рендера (разрешаем клиенту и отключаем кеш) –––––––––––––
export const dynamic = 'force-dynamic';
export const revalidate = false;

// Типы
type Master = {
  id: string;
  name: string;
  lat: number;
  lon: number;
  updatedAt: number | null;
};

// Достаём части react-leaflet динамически (без SSR)
const MapContainer = dynamicImport(() => import('react-leaflet').then(m => m.MapContainer), { ssr: false });
const TileLayer    = dynamicImport(() => import('react-leaflet').then(m => m.TileLayer),    { ssr: false });
const Marker       = dynamicImport(() => import('react-leaflet').then(m => m.Marker),       { ssr: false });
const Popup        = dynamicImport(() => import('react-leaflet').then(m => m.Popup),        { ssr: false });

export default function Page() {
  const [masters, setMasters] = useState<Master[]>([]);
  const [loading, setLoading] = useState(true);
  const [icon, setIcon] = useState<any>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Центр Калуги
  const kaluga = useMemo(() => ({ lat: 54.506, lon: 36.252 }), []);

  // Готовим чёрную метку (SVG) — один раз на клиенте
  useEffect(() => {
    (async () => {
      const L = (await import('leaflet')).default;
      const i = new L.Icon({
        iconUrl:
          'data:image/svg+xml;utf8,' +
          encodeURIComponent(
            `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="48" viewBox="0 0 384 512">
               <path fill="black"
                 d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 272a80 80 0 1 1 0-160 80 80 0 1 1 0 160z"/>
             </svg>`
          ),
        iconSize: [24, 36],
        iconAnchor: [12, 36],
        popupAnchor: [0, -36],
      });
      setIcon(i);
    })();
  }, []);

  // Подгрузка мастеров + автообновление
  async function load() {
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;
    try {
      const res = await fetch('/api/masters/all', { cache: 'no-store', signal: ac.signal });
      const data = (await res.json()) as Master[];
      setMasters(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    const t = setInterval(load, 5000); // обновляем каждые 5 сек
    return () => { clearInterval(t); abortRef.current?.abort(); };
  }, []);

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-2xl font-bold mb-4">Трекинг мастеров</h1>

      <div className="rounded-3xl border bg-white p-2 shadow-sm">
        <div className="h-[70vh] w-full overflow-hidden rounded-2xl">
          <MapContainer
            center={[kaluga.lat, kaluga.lon]}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              attribution="&copy; OpenStreetMap &copy; CARTO"
            />
            {icon && masters.map(m => (
              <Marker key={m.id} position={[m.lat, m.lon]} icon={icon}>
                <Popup>
                  <div className="font-semibold">{m.name}</div>
                  <div className="text-xs text-gray-600">
                    {m.updatedAt ? new Date(m.updatedAt).toLocaleTimeString() : 'нет данных'}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      {loading && <div className="mt-3 text-sm text-gray-500">Загрузка…</div>}
    </main>
  );
}
