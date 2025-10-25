'use client';

import { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L, { LatLngExpression, Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

type MasterPoint = { id: string; lat: number; lon: number };

// Чёрная метка (SVG data URL)
const blackPinSvg =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" fill="black">
      <path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/>
    </svg>`
  );

const masterIcon: Icon = L.icon({
  iconUrl: blackPinSvg,
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [0, -26],
});

export default function MapWithMasters({ height = '420px' }: { height?: string }) {
  const [points, setPoints] = useState<MasterPoint[]>([]);
  const center = useMemo<LatLngExpression>(() => [54.513845, 36.261215], []); // Калуга

  useEffect(() => {
    let stop = false;

    const load = async () => {
      try {
        const res = await fetch('/api/masters/all', { cache: 'no-store' });
        if (!res.ok) return;
        const data: { members: string[] } = await res.json();
        const parsed: MasterPoint[] = (data?.members ?? []).map((raw, idx) => {
          const [lngStr, latStr] = raw.split(',').map((s) => s.trim());
          return { id: String(idx + 1), lat: Number(latStr), lon: Number(lngStr) };
        });
        if (!stop) setPoints(parsed);
      } catch {}
    };

    load();
    const id = setInterval(load, 5000);
    return () => { stop = true; clearInterval(id); };
  }, []);

  return (
    <div className="w-full rounded-2xl overflow-hidden border bg-white dark:bg-gray-900">
      <MapContainer center={center} zoom={13} style={{ height }} scrollWheelZoom className="z-0">
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution="&copy; OpenStreetMap & CARTO"
        />
        {points.map(({ id, lat, lon }) => (
          <Marker key={id} position={[lat, lon]} icon={masterIcon}>
            <Popup>Мастер {id}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
