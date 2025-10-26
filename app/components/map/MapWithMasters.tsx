'use client';

import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

type Props = {
  height?: string;
};

// Центр: Калуга
const KALUGA: [number, number] = [54.5138, 36.2612];

// Демо-точки мастеров (можно заменить на реальные данные)
const masters = [
  { id: 1, name: 'Саша', lat: 54.5205, lon: 36.2702 },
  { id: 2, name: 'Игорь', lat: 54.5052, lon: 36.2501 },
  { id: 3, name: 'Антон', lat: 54.498,  lon: 36.29   },
];

export default function MapWithMasters({ height = '420px' }: Props) {
  return (
    <div className="w-full overflow-hidden rounded-xl" style={{ height }}>
      <MapContainer
        center={KALUGA}
        zoom={12}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />

        {masters.map((m) => (
          <CircleMarker
            key={m.id}
            center={[m.lat, m.lon]}
            radius={8}
            pathOptions={{ color: '#2563eb', fillColor: '#60a5fa', fillOpacity: 0.9 }}
          >
            <Popup>Мастер {m.name}</Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
