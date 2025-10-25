'use client';

import { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import type { LatLngExpression } from 'leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

type MasterPoint = {
  id: string;
  lat: number;
  lon: number;
  updatedAt?: number;
};

const KALUGA: LatLngExpression = [54.5138, 36.2612];

const blackPin = new L.Icon({
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  shadowSize: [41, 41],
});

export default function MapWithMasters({ height = '420px' }: { height?: string }) {
  const [masters, setMasters] = useState<MasterPoint[] | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch('/api/masters/all', { cache: 'no-store' });
        if (!res.ok) return;
        const data: MasterPoint[] = await res.json();
        if (!cancelled) setMasters(data);
      } catch {}
    }

    load();
    const t = setInterval(load, 5000);
    return () => {
      cancelled = true;
      clearInterval(t);
    };
  }, []);

  const bounds = useMemo(() => {
    if (!masters || masters.length === 0) return null;
    return L.latLngBounds(masters.map((m) => [m.lat, m.lon] as [number, number]));
  }, [masters]);

  return (
    <div style={{ height, width: '100%', borderRadius: 16, overflow: 'hidden' }}>
      <MapContainer
        center={KALUGA}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom
        preferCanvas
        bounds={bounds ?? undefined}
        boundsOptions={{ padding: [40, 40] }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution="&copy; OpenStreetMap &copy; CARTO"
        />

        {(masters ?? []).map((m) => (
          <Marker key={m.id} position={[m.lat, m.lon]} icon={blackPin}>
            <Popup>
              <div className="text-sm">
                <div className="font-semibold">Мастер {m.id}</div>
                {m.updatedAt ? (
                  <div className="text-gray-600">
                    Обновлено: {new Date(m.updatedAt).toLocaleTimeString()}
                  </div>
                ) : null}
                <div className="text-gray-600">lat: {m.lat.toFixed(5)}</div>
                <div className="text-gray-600">lon: {m.lon.toFixed(5)}</div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
