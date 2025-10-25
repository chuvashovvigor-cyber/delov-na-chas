'use client';

import { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import type { LatLngExpression, IconOptions } from 'leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

type Master = {
  id: string;
  lat: number;
  lon: number;
  ts?: number;
};

type Props = {
  height?: string;
};

// Чёрная метка (можешь заменить на свой SVG/PNG)
// Пример: <img src="/icons/master.svg" />
const masterIcon = useMemoIcon({
  iconUrl:
    'data:image/svg+xml;utf8,\
<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36">\
  <circle cx="18" cy="18" r="9" fill="black"/>\
  <circle cx="18" cy="18" r="4" fill="white"/>\
</svg>',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -24],
});

export default function MapWithMasters({ height = '420px' }: Props) {
  const [masters, setMasters] = useState<Master[]>([]);
  const center: LatLngExpression = [54.5138, 36.2612]; // Калуга по умолчанию

  // Пулинг геопозиций мастеров
  useEffect(() => {
    let stop = false;

    const load = async () => {
      try {
        const r = await fetch('/api/masters/all', { cache: 'no-store' });
        if (!r.ok) throw new Error('fetch failed');
        const data = (await r.json()) as Master[];
        if (!stop) setMasters(data ?? []);
      } catch {}
    };

    load();
    const t = setInterval(load, 10_000); // каждые 10 сек
    return () => {
      stop = true;
      clearInterval(t);
    };
  }, []);

  return (
    <div className="w-full overflow-hidden rounded-2xl border bg-white">
      <MapContainer
        center={center}
        zoom={13}
        style={{ height, width: '100%' }}
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; OpenStreetMap & CARTO'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png"
        />

        {masters.map((m) => (
          <Marker key={m.id} position={[m.lat, m.lon]} icon={masterIcon}>
            <Popup>
              <div className="text-sm">
                <div className="font-semibold">Мастер {m.id}</div>
                <div>lat: {m.lat.toFixed(5)}</div>
                <div>lon: {m.lon.toFixed(5)}</div>
                {m.ts && (
                  <div className="text-gray-500">
                    {new Date(m.ts).toLocaleString()}
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

/** Хелпер, чтобы не пересоздавать L.icon на каждый рендер */
function useMemoIcon(opts: IconOptions) {
  return useMemo(() => L.icon(opts), []);
}
