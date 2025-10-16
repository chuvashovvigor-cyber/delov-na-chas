'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

type Props = {
  city: string;
  onChange: (p: { lat: number; lon: number; address?: string }) => void;
};

// Ленивая загрузка react-leaflet только на клиенте
const MapContainer = dynamic(
  async () => (await import('react-leaflet')).MapContainer,
  { ssr: false }
);
const TileLayer = dynamic(async () => (await import('react-leaflet')).TileLayer, { ssr: false });
const Marker = dynamic(async () => (await import('react-leaflet')).Marker, { ssr: false });
const useMapEvents = (await import('react-leaflet')).useMapEvents; // типы, не ломает SSR

export default function OrderClient({ city, onChange }: Props) {
  // Центр для Калуги
  const cityCenter = useMemo(() => {
    if (city === 'Калуга') return { lat: 54.513845, lon: 36.261215, zoom: 14 };
    return { lat: 54.513845, lon: 36.261215, zoom: 14 };
  }, [city]);

  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Array<{ label: string; lat: number; lon: number }>>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [marker, setMarker] = useState<{ lat: number; lon: number } | null>(null);
  const [selectedLabel, setSelectedLabel] = useState<string>('');

  const boxRef = useRef<HTMLDivElement | null>(null);

  // Поиск по Nominatim (OpenStreetMap) — живые подсказки
  useEffect(() => {
    let cancelled = false;
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }
    const handler = setTimeout(async () => {
      try {
        setLoading(true);
        const url = new URL('https://nominatim.openstreetmap.org/search');
        url.searchParams.set('q', `${city} ${query}`);
        url.searchParams.set('format', 'json');
        url.searchParams.set('addressdetails', '1');
        url.searchParams.set('limit', '8');
        const res = await fetch(url.toString(), {
          headers: { 'Accept-Language': 'ru' },
        });
        const data: any[] = await res.json();
        if (cancelled) return;
        const list = data.map((it) => ({
          label: it.display_name as string,
          lat: Number(it.lat),
          lon: Number(it.lon),
        }));
        setSuggestions(list);
      } catch {
        // ignore
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 250); // debounce
    return () => {
      cancelled = true;
      clearTimeout(handler);
    };
  }, [query, city]);

  // Выбор подсказки
  function chooseItem(item: { label: string; lat: number; lon: number }) {
    setSelectedLabel(item.label);
    setQuery(item.label);
    setSuggestions([]);
    const p = { lat: item.lat, lon: item.lon };
    setMarker(p);
    onChange({ ...p, address: item.label });
  }

  // Обратное геокодирование при перемещении маркера / клике по карте
  async function reverseGeocode(lat: number, lon: number) {
    try {
      const url = new URL('https://nominatim.openstreetmap.org/reverse');
      url.searchParams.set('format', 'json');
      url.searchParams.set('lat', String(lat));
      url.searchParams.set('lon', String(lon));
      url.searchParams.set('addressdetails', '1');
      const res = await fetch(url.toString(), {
        headers: { 'Accept-Language': 'ru' },
      });
      const data: any = await res.json();
      const label: string = data.display_name ?? '';
      setSelectedLabel(label);
      setQuery(label);
      onChange({ lat, lon, address: label });
    } catch {
      onChange({ lat, lon });
    }
  }

  // Слой слушателя кликов по карте
  function ClickCatcher() {
    // @ts-ignore — типы подтянутся на клиенте
    useMapEvents({
      click(e: any) {
        const lat = e.latlng.lat as number;
        const lon = e.latlng.lng as number;
        setMarker({ lat, lon });
        reverseGeocode(lat, lon);
      },
    });
    return null;
  }

  return (
    <div className="mt-6">
      {/* ВАЖНО: relative — создаёт стек для absolute-списка */}
      <div ref={boxRef} className="relative">
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelectedLabel('');
          }}
          placeholder="Начните вводить адрес…"
          className="w-full rounded-xl border px-3 py-2"
        />

        {/* Выпадающий список — поверх карты */}
        {suggestions.length > 0 && (
          <ul className="absolute z-50 mt-1 max-h-64 w-full overflow-auto rounded-xl border bg-white shadow-lg">
            {suggestions.map((s, i) => (
              <li
                key={`${s.lat}-${s.lon}-${i}`}
                className="cursor-pointer px-3 py-2 text-sm hover:bg-gray-50"
                onClick={() => chooseItem(s)}
              >
                {s.label}
              </li>
            ))}
            {loading && (
              <li className="px-3 py-2 text-xs text-gray-500 border-t">Поиск…</li>
            )}
          </ul>
        )}
      </div>

      {/* Контейнер карты — ниже списка (z-0) */}
      <div className="relative z-0 mt-3 overflow-hidden rounded-2xl border">
        <MapContainer
          center={[cityCenter.lat, cityCenter.lon]}
          zoom={cityCenter.zoom}
          style={{ height: 360 }}
          scrollWheelZoom
        >
          {/* Светлая современная подложка Carto */}
          <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png" />
          <ClickCatcher />
          {marker && (
            <Marker
              position={[marker.lat, marker.lon]}
              draggable
              // @ts-ignore react-leaflet типы ок
              eventHandlers={{
                dragend: (e: any) => {
                  const { lat, lng } = e.target.getLatLng();
                  setMarker({ lat, lon: lng });
                  reverseGeocode(lat, lng);
                },
              }}
              // Чёрная точка-иконка
              icon={L.icon({
                iconUrl:
                  'data:image/svg+xml;utf8,' +
                  encodeURIComponent(
                    `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28">
                      <circle cx="14" cy="14" r="7" fill="#111111"/>
                      <circle cx="14" cy="14" r="9" fill="none" stroke="#111111" stroke-opacity="0.25" stroke-width="2"/>
                    </svg>`
                  ),
                iconSize: [28, 28],
                iconAnchor: [14, 14],
              })}
            />
          )}
        </MapContainer>
      </div>

      {/* Подписка-подсказка текущего адреса */}
      {selectedLabel && (
        <div className="mt-3 text-sm text-gray-700">{selectedLabel}</div>
      )}
    </div>
  );
}
