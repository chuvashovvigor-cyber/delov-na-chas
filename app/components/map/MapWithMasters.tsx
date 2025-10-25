'use client';

import { useMemo } from 'react';
import useSWR from 'swr';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

type Master = {
  id: string | number;
  lat: number;
  lon: number;
  // опционально: status?: string;
};

const fetcher = (url: string) => fetch(url).then((r) => r.json());

/** Кастомная иконка мастера (положи /public/markers/master.svg или master.png) */
const masterIcon = new L.Icon({
  iconUrl: '/markers/master.svg', // можно заменить на .png
  iconRetinaUrl: '/markers/master.svg',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -36],
  className: 'master-marker',
});

const KALUGA: [number, number] = [54.513845, 36.261215];

interface Props {
  /** высота карты (по умолчанию 420px) */
  height?: string;
  /** зум старта */
  zoom?: number;
}

export default function MapWithMasters({ height = '420px', zoom = 13 }: Props) {
  // тянем мастеров с периодическим обновлением
  const { data, error } = useSWR<Master[]>('/api/masters/all', fetcher, {
    refreshInterval: 2000, // 2 сек; можно увеличить, чтобы экономить лимиты
    revalidateOnFocus: false,
  });

  const masters = useMemo(() => data ?? [], [data]);

  return (
    <div
      className="rounded-2xl overflow-hidden border bg-white"
      style={{ height }}
    >
      <MapContainer
        center={KALUGA}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom
      >
        {/* Тёплый, «современный» стиль */}
        <TileLayer
          attribution='&copy; OpenStreetMap & CARTO'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {masters.map(({ id, lat, lon }) => (
          <Marker key={String(id)} position={[lat, lon]} icon={masterIcon}>
            <Popup>
              Мастер {String(id)}
              <br />
              lat: {lat.toFixed(5)} / lon: {lon.toFixed(5)}
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* простая приписка-состояния снизу карты */}
      <div className="px-3 py-2 text-xs text-gray-500 border-t bg-white/70 backdrop-blur">
        {error && 'Ошибка загрузки мастеров'}
        {!error && !data && 'Загружаем мастеров…'}
        {!error && data && `${masters.length} мастера(ов) на карте`}
      </div>
    </div>
  );
}
