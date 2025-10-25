'use client';

import { useMemo } from 'react';
import useSWR from 'swr';
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

const fetcher = (url: string) => fetch(url, { cache: 'no-store' }).then((r) => r.json());

export default function MapWithMasters({
  height = '420px',
  center = KALUGA_CENTER,
  zoom = 13,
}: Props) {
  const { data } = useSWR('/api/masters/all', fetcher, { refreshInterval: 5000 });

  const masters =
    (data?.items as Array<{ id: string; lat: number; lon: number; status?: string }>) ?? [];

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
              <Popup>Мастер {m.id}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
