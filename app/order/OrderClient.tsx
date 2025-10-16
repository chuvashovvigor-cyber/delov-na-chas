'use client';

import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { Icon, LatLngExpression } from 'leaflet';

// динамические импорты без SSR
const MapContainer = dynamic(
  () => import('react-leaflet').then((m) => m.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(() => import('react-leaflet').then((m) => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then((m) => m.Marker), { ssr: false });

type Props = {
  city: string;
  onChange: (p: { lat: number; lon: number; address?: string }) => void;
};

export default function OrderClient({ city, onChange }: Props) {
  const cityCenter = useMemo(() => {
    if (city === 'Калуга') return { lat: 54.513845, lon: 36.261215, zoom: 14 };
    return { lat: 54.513845, lon: 36.261215, zoom: 14 };
  }, [city]);

  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<
    Array<{ label: string; lat: number; lon: number }>
  >([]);
  const [loading, setLoading] = useState(false);
  const [marker, setMarker] = useState<{ lat: number; lon: number } | null>(null);
  const [selectedLabel, setSelectedLabel] = useState<string>('');

  // live-подсказки (OSM/Nominatim)
  useEffect(() => {
    let cancelled = false;
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }
    const t = setTimeout(async () => {
      try {
        setLoading(true);
        const url = new URL('https://nominatim.openstreetmap.org/search');
        url.searchParams.set('q', `${city} ${query}`);
        url.searchParams.set('format', 'json');
        url.searchParams.set('addressdetails', '1');
        url.searchParams.set('limit', '8');
        const res = await fetch(url.toString(), { headers: { 'Accept-Language': 'ru' } });
        const data: any[] = await res.json();
        if (cancelled) return;
        setSuggestions(
          data.map((it) => ({ label: it.display_name as string, lat: +it.lat, lon: +it.lon }))
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [query, city]);

  function chooseItem(item: { label: string; lat: number; lon: number }) {
    setSelectedLabel(item.label);
    setQuery(item.label);
    setSuggestions([]);
    const p = { lat: item.lat, lon: item.lon };
    setMarker(p);
    onChange({ ...p, address: item.label });
  }

  async function reverseGeocode(lat: number, lon: number) {
    try {
      const url = new URL('https://nominatim.openstreetmap.org/reverse');
      url.searchParams.set('format', 'json');
      url.searchParams.set('lat', String(lat));
      url.searchParams.set('lon', String(lon));
      url.searchParams.set('addressdetails', '1');
      const res = await fetch(url.toString(), { headers: { 'Accept-Language': 'ru' } });
      const data: any = await res.json();
      const label = data.display_name ?? '';
      setSelectedLabel(label);
      setQuery(label);
      onChange({ lat, lon, address: label });
    } catch {
      onChange({ lat, lon });
    }
  }

  // чёрная метка
  const blackIcon = useMemo(
    () =>
      new Icon({
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
      }),
    []
  );

  // обработчик инициализации карты — вешаем click и reverse geocode
  // (типизируем через any, т.к. у некоторых версий типов нет whenCreated)
  const handleMapCreated = (map: any) => {
    map.on('click', (e: any) => {
      const { lat, lng } = e.latlng;
      setMarker({ lat, lon: lng });
      reverseGeocode(lat, lng);
    });
  };

  return (
    <div className="mt-6">
      {/* поиск над картой */}
      <div className="relative">
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelectedLabel('');
          }}
          placeholder="Начните вводить адрес…"
          className="w-full rounded-xl border px-3 py-2"
        />

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
            {loading && <li className="px-3 py-2 text-xs text-gray-500 border-t">Поиск…</li>}
          </ul>
        )}
      </div>

      {/* карта под поиском */}
      <div className="relative z-0 mt-3 overflow-hidden rounded-2xl border">
        <MapContainer
          center={[cityCenter.lat, cityCenter.lon] as LatLngExpression}
          zoom={cityCenter.zoom}
          style={{ height: 360 }}
          scrollWheelZoom
          // >>> гасим претензии TS к whenCreated типом any
          {...({ whenCreated: handleMapCreated } as any)}
        >
          {/* современная светлая подложка */}
          <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png" />
          {marker && (
            <Marker
              position={[marker.lat, marker.lon] as LatLngExpression}
              draggable
              eventHandlers={{
                dragend: (e: any) => {
                  const { lat, lng } = e.target.getLatLng();
                  setMarker({ lat, lon: lng });
                  reverseGeocode(lat, lng);
                },
              }}
              icon={blackIcon}
            />
          )}
        </MapContainer>
      </div>

      {selectedLabel && <div className="mt-3 text-sm text-gray-700">{selectedLabel}</div>}
    </div>
  );
}
