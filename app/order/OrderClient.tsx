'use client';

import { useEffect, useRef } from 'react';
// Типы у leaflet нам не критичны — импортируем динамически и глушим TS
// (так тоже пройдёт билд без установки @types/leaflet)
import 'leaflet/dist/leaflet.css';

export default function OrderClient() {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let map: any;

    (async () => {
      // @ts-expect-error — типы для leaflet не устанавливаем, импорт ок
      const L = await import('leaflet');

      if (!mapRef.current) return;

      map = L.map(mapRef.current).setView([54.513845, 36.261215], 12); // Калуга

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      // Кастомная метка (используем any чтобы не упираться в типы)
      const icon: any = L.icon({
        iconUrl:
          'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl:
          'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl:
          'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        tooltipAnchor: [0, -34],
        shadowSize: [41, 41],
      });

      L.marker([54.513845, 36.261215], { icon }).addTo(map).bindPopup('Калуга');
    })();

    return () => {
      try {
        // аккуратно уничтожаем карту, если уже создана
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (map as any)?.remove?.();
      } catch {}
    };
  }, []);

  return (
    <div
      ref={mapRef}
      className="mt-4 w-full rounded-2xl border bg-gray-100"
      style={{ height: 320 }}
    />
  );
}
