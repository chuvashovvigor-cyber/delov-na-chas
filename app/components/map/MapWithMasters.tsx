'use client';

import {useEffect, useMemo, useState} from 'react';
import {MapContainer, TileLayer, Marker, Popup} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

type Master = { id: string; lat: number; lon: number };

type Props = {
  height?: string;   // например "420px"
  zoom?: number;     // по умолчанию 12
};

// Калуга по умолчанию
const KALUGA: [number, number] = [54.514, 36.255];

export default function MapWithMasters({ height = '420px', zoom = 12 }: Props) {
  const [masters, setMasters] = useState<Master[]>([]);
  const [center] = useState<[number, number]>(KALUGA);

  // Чёрная метка-мастер (можешь заменить url на свою SVG/PNG иконку)
  const masterIcon = useMemo(
    () =>
      L.icon({
        iconUrl:
          'data:image/svg+xml;utf8,' +
          encodeURIComponent(
            `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36">
               <circle cx="18" cy="18" r="10" fill="black"/>
               <circle cx="18" cy="18" r="3" fill="white"/>
             </svg>`
          ),
        iconSize: [36, 36],
        iconAnchor: [18, 18],
        popupAnchor: [0, -18],
      }),
    []
  );

  // Поллинг раз в 5 сек
  useEffect(() => {
    let stop = false;
    let timer: number | undefined;

    const load = async () => {
      try {
        const res = await fetch('/api/masters/all', { cache: 'no-store' });
        if (!res.ok) throw new Error('Bad response');
        const data: Master[] = await res.json();
        if (!stop) setMasters(Array.isArray(data) ? data : []);
      } catch {
        // молча игнорируем
      } finally {
        if (!stop) timer = window.setTimeout(load, 5000);
      }
    };

    load();
    return () => {
      stop = true;
      if (timer) window.clearTimeout(timer);
    };
  }, []);

  return (
    <div className="rounded-2xl border overflow-hidden">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom
        style={{ height }}
        className="w-full"
      >
        <TileLayer
          // светлая и читабельная тема + номера домов
          url="https://{s}.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap & CARTO"
        />

        {masters.map((m) => (
          <Marker key={m.id} position={[m.lat, m.lon]} icon={masterIcon}>
            <Popup>Мастер {m.id}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
