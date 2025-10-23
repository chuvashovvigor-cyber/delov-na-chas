'use client';

import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';

// react-leaflet только на клиенте
const MapContainer = dynamic(
  async () => (await import('react-leaflet')).MapContainer,
  { ssr: false }
);
const TileLayer = dynamic(async () => (await import('react-leaflet')).TileLayer, { ssr: false });
const Marker = dynamic(async () => (await import('react-leaflet')).Marker, { ssr: false });
const Popup = dynamic(async () => (await import('react-leaflet')).Popup, { ssr: false });

import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Чёрная метка (под стиль сайта)
const blackPin = new L.Icon({
  iconUrl:
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="46" viewBox="0 0 30 46" fill="none">
        <path d="M15 46c6.6-10.4 15-18 15-28C30 8.0 23.3 0 15 0S0 8.0 0 18c0 10 8.4 17.6 15 28z" fill="black"/>
        <circle cx="15" cy="18" r="6" fill="white"/>
      </svg>`
    ),
  iconSize: [30, 46],
  iconAnchor: [15, 46],
  popupAnchor: [0, -40],
});

type Master = {
  id: string;
  lat: number;
  lon: number;
  name?: string;
  status?: string;
  ts?: number; // unix ms
};

export default function TrackMap() {
  const [masters, setMasters] = useState<Master[]>([]);
  const [center, setCenter] = useState<[number, number]>([54.5138, 36.2612]); // Калуга по умолчанию
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const res = await fetch('/api/masters/all', { cache: 'no-store' });
      if (!res.ok) throw new Error('failed');
      const data = (await res.json()) as Master[];

      setMasters(
        (data || []).filter(
          (m) =>
            typeof m.lat === 'number' &&
            typeof m.lon === 'number' &&
            !Number.isNaN(m.lat) &&
            !Number.isNaN(m.lon)
        )
      );

      if (loading && data?.length) {
        setCenter([data[0].lat, data[0].lon]);
        setLoading(false);
      }
    } catch {
      // молча
    }
  }

  useEffect(() => {
    load();
    const id = setInterval(load, 3000); // опрос раз в 3 сек
    return () => clearInterval(id);
  }, []);

  const mapCenter = useMemo(() => center, [center]);

  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Активных мастеров: <b>{masters.length}</b>
        </div>
        <button
          className="text-sm rounded-xl px-3 py-1 bg-gray-900 text-white"
          onClick={load}
        >
          Обновить
        </button>
      </div>

      <div className="overflow-hidden rounded-xl">
        <MapContainer
          center={mapCenter}
          zoom={13}
          style={{ height: 420, width: '100%' }}
          scrollWheelZoom
        >
          <TileLayer
            // Поживее стиль (Carto Voyager)
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            attribution='&copy; OpenStreetMap &copy; CARTO'
          />

          {masters.map((m) => (
            <Marker key={m.id} position={[m.lat, m.lon]} icon={blackPin}>
              <Popup>
                <div className="text-sm">
                  <div className="font-semibold">{m.name || `Мастер ${m.id}`}</div>
                  <div className="text-gray-600">
                    {m.status ? `Статус: ${m.status}` : 'Статус: —'}
                  </div>
                  {m.ts ? (
                    <div className="text-gray-500">
                      Обновлён: {new Date(m.ts).toLocaleTimeString()}
                    </div>
                  ) : null}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <p className="mt-3 text-xs text-gray-500">
        Точки обновляются в реальном времени по данным бота (Upstash Redis).
      </p>
    </div>
  );
}
