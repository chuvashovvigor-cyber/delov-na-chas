'use client';

import { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';

type Point = { lat: number; lon: number; address?: string };
type Suggest = { display_name: string; lat: string; lon: string };

type Props = {
  value?: Point;
  onChange?: (p: Point) => void;
  /** необязательно: сюда можно передать координаты активных мастеров */
  masters?: Array<{ lat: number; lon: number; name?: string }>;
};

export default function OrderClient({ value, onChange, masters = [] }: Props) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const instanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggests, setSuggests] = useState<Suggest[]>([]);

  // иконки
  const getUserIcon = (L: any) =>
    L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      shadowSize: [41, 41],
    });

  const getMasterIcon = (L: any) =>
    L.divIcon({
      className: 'master-icon',
      html:
        '<div style="font-size:22px;line-height:22px;transform:translate(-50%,-50%)">🚗😺</div>',
      iconSize: [22, 22],
      iconAnchor: [11, 11],
    });

  // инициализация карты
  useEffect(() => {
    let map: any;
    let Lmod: any;

    (async () => {
      // @ts-expect-error no types
      const L = await import('leaflet');
      Lmod = L;

      if (!mapRef.current) return;

      // Калуга по умолчанию
      const start: [number, number] = value
        ? [value.lat, value.lon]
        : [54.513845, 36.261215];

      map = L.map(mapRef.current).setView(start, 12);

      // посимпатичнее тайлы
      L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
        {
          attribution:
            '&copy; OpenStreetMap &copy; CARTO',
          maxZoom: 19,
        }
      ).addTo(map);

      // маркер пользователя
      markerRef.current = L.marker(start, {
        draggable: true,
        icon: getUserIcon(L),
      })
        .addTo(map)
        .bindPopup('Ваш адрес');

      // клик по карте — ставим маркер, реверс-геокодим
      map.on('click', async (e: any) => {
        const lat = e.latlng.lat;
        const lon = e.latlng.lng;
        markerRef.current.setLatLng([lat, lon]);
        map.panTo([lat, lon]);
        const addr = await reverseGeocode(lat, lon);
        onChange?.({ lat, lon, address: addr });
      });

      // перетаскивание маркера — реверс-геокодим
      markerRef.current.on('dragend', async () => {
        const { lat, lng } = markerRef.current.getLatLng();
        const addr = await reverseGeocode(lat, lng);
        onChange?.({ lat, lon: lng, address: addr });
      });

      // мастера (если передали)
      masters.forEach((m) => {
        L.marker([m.lat, m.lon], { icon: getMasterIcon(L) })
          .addTo(map)
          .bindPopup(m.name || 'Мастер');
      });

      instanceRef.current = { map, L };
    })();

    return () => {
      try {
        instanceRef.current?.map?.remove?.();
      } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // если пришло начальное значение — переставим маркер
  useEffect(() => {
    if (!value || !instanceRef.current || !markerRef.current) return;
    markerRef.current.setLatLng([value.lat, value.lon]);
    instanceRef.current.map.panTo([value.lat, value.lon]);
  }, [value]);

  // debounced подсказки
  useEffect(() => {
    if (!query.trim()) {
      setSuggests([]);
      return;
    }
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const r = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&limit=5&accept-language=ru&q=${encodeURIComponent(
            query
          )}`,
          { headers: { 'Accept': 'application/json' } }
        );
        const data: Suggest[] = await r.json();
        setSuggests(data);
      } catch {
        setSuggests([]);
      } finally {
        setLoading(false);
      }
    }, 350);
    return () => clearTimeout(t);
  }, [query]);

  async function reverseGeocode(lat: number, lon: number) {
    try {
      const r = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&accept-language=ru&lat=${lat}&lon=${lon}`
      );
      const j = await r.json();
      return j?.display_name as string;
    } catch {
      return '';
    }
  }

  async function pickSuggestion(s: Suggest) {
    const lat = parseFloat(s.lat);
    const lon = parseFloat(s.lon);
    // visual
    markerRef.current?.setLatLng([lat, lon]);
    instanceRef.current?.map?.panTo([lat, lon]);
    setSuggests([]);
    setQuery(s.display_name);
    // callback вверх
    onChange?.({ lat, lon, address: s.display_name });
  }

  return (
    <div className="mt-4">
      {/* Поиск адреса + подсказки */}
      <div className="relative">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Начните вводить адрес…"
          className="w-full rounded-xl border px-3 py-2"
        />
        {!!suggests.length && (
          <div className="absolute z-10 mt-1 w-full rounded-xl border bg-white shadow">
            {suggests.map((s, i) => (
              <button
                key={i}
                type="button"
                onClick={() => pickSuggestion(s)}
                className="block w-full text-left px-3 py-2 hover:bg-gray-50"
              >
                {s.display_name}
              </button>
            ))}
          </div>
        )}
        {loading && (
          <div className="absolute right-3 top-2.5 text-xs text-gray-500">
            ищем…
          </div>
        )}
      </div>

      {/* Карта */}
      <div
        ref={mapRef}
        className="mt-3 w-full rounded-2xl border bg-gray-100"
        style={{ height: 360 }}
      />
    </div>
  );
}
