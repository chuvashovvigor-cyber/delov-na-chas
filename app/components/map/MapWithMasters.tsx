'use client';

import { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Центр по умолчанию — КАЛУГА
const KALUGA_CENTER: [number, number] = [54.513845, 36.261215];

// Иконка мастера (положи свой файл в /public/icons/master.svg или .png)
const masterIcon = L.icon({
  iconUrl: '/icons/master.svg', // можно заменить на .png
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -30],
});

type Props = {
  height?: string;
  center?: [number, number];
  zoom?: number;
};

type Master = { id: string; lat: number; lon: number; status?: string };

export default function MapWithMasters({
  height = '420px',
  center = KALUGA_CENTER,
  zoom = 13,
}: Props) {
  const [masters, setMasters] = useState<Master[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Поллинг без SWR
  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setInterval> | null = null;

    const load = async () => {
      try {
        const res = await fetch('/api/masters/all', { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to load masters');
        const data = await res.json();
        if (!cancelled) setMasters((data?.items as Master[]) ?? []);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? 'Error');
      }
    };

    // Первичная загрузка и интервал 5с
    load();
    timer = setInterval(load, 5000);

    return () => {
      cancelled = true;
      if (timer) clearInterval(timer);
    };
  }, []);

  return (
    <div className="w-full overflow-hidden rounded-2xl border bg-white">
      <div style={{ height }}>
        <MapContainer
          center={center}
          zoom={zoom}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom
        >
          <TileLayer
            // более «цветная» подложка
            url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap, &copy; CARTO"
          />

          {masters.map((m) => (
            <Marker key={m.id} position={[m.lat, m.lon]} icon={masterIcon}>
              <Popup>
                <div className="text-sm">
                  <div className="font-semibold">Мастер {m.id}</div>
                  {m.status && <div className="text-gray-600">Статус: {m.status}</div>}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {error && (
        <div className="p-2 text-xs text-red-600 border-t bg-red-50">
          Ошибка загрузки: {error}
        </div>
      )}
    </div>
  );
}
