// components/map/MapWithMasters.tsx
'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useMemo } from 'react';

type Props = { height?: string };

const defaultIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function MapWithMasters({ height = '360px' }: Props) {
  // Калуга
  const center = useMemo<[number, number]>(() => [54.513845, 36.261215], []);
  return (
    <div className="w-full rounded-xl overflow-hidden border border-zinc-800">
      <MapContainer center={center} zoom={14} style={{ height }} scrollWheelZoom className="bg-zinc-900">
        <TileLayer
          attribution="&copy; OpenStreetMap &copy; CARTO"
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <Marker position={center} icon={defaultIcon}>
          <Popup>Мастер рядом</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
