'use client';

import { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';

type Point = { lat: number; lon: number; address?: string };
type Suggest = { display_name: string; lat: string; lon: string };

type Props = {
  value?: Point;
  onChange?: (p: Point) => void;
  masters?: Array<{ lat: number; lon: number; name?: string }>;
  city?: string; // <— НОВОЕ: город из селекта
};

export default function OrderClient({
  value,
  onChange,
  masters = [],
  city = 'Калуга',
}: Props) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const instanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggests, setSuggests] = useState<Suggest[]>([]);
  const [active, setActive] = useState(0); // индекс подсветки в списке

  // ====== ТАЙЛЫ (современные, цветные) ======
  const TILE = {
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '&copy; OpenStreetMap &copy; CARTO',
    maxZoom: 20,
  };

  // чёрная метка (divIcon)
  const getUserIcon = (L: any) =>
    L.divIcon({
      className: '',
      html:
        '<div style="width:18px;height:18px;border-radius:50%;background:#111;border:2px solid #fff;box-shadow:0 0 0 2px rgba(0,0,0,.25);transform:translate(-50%,-50%)"></div>',
      iconSize: [18, 18],
      iconAnchor: [9, 9],
    });

  // мастер (машинка-эмодзи)
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
    (async () => {
      // @ts-expect-error no types
      const L = await import('leaflet');
      if (!mapRef.current) return;

      const start: [number, number] = value
        ? [value.lat, value.lon]
        : [54.513845, 36.261215]; // Калуга

      map = L.map(mapRef.current, { zoomControl: true }).setView(start, 13);
      L.tileLayer(TILE.url, { attribution: TILE.attribution, maxZoom: TILE.maxZoom }).addTo(map);

      markerRef.current = L.marker(start, {
        draggable: true,
        icon: getUserIcon(L),
      })
        .addTo(map)
        .bindPopup('Ваш адрес');

      // клик по карте
      map.on('click', async (e: any) => {
        await placePoint(e.latlng.lat, e.latlng.lng, true);
      });

      // перетаскивание
      markerRef.current.on('dragend', async () => {
        const { lat, lng } = markerRef.current.getLatLng();
        await placePoint(lat, lng, true);
      });

      // мастера
      masters.forEach((m) =>
        L.marker([m.lat, m.lon], { icon: getMasterIcon(L) })
          .addTo(map)
          .bindPopup(m.name || 'Мастер')
      );

      instanceRef.current = { map, L };
    })();

    return () => {
      try {
        instanceRef.current?.map?.remove?.();
      } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // когда value меняется извне — двигаем метку
  useEffect(() => {
    if (!value || !instanceRef.current || !markerRef.current) return;
    markerRef.current.setLatLng([value.lat, value.lon]);
    instanceRef.current.map.panTo([value.lat, value.lon]);
  }, [value]);

  // ====== ЖИВОЙ ПОИСК (с дебаунсом) ======
  useEffect(() => {
    if (!query.trim()) {
      setSuggests([]);
      return;
    }
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        // сужаем поиск к городу + RU, добавляем детали адреса
        const q = `${query}, ${city}`;
        const r = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&limit=7&addressdetails=1&accept-language=ru&countrycodes=ru&q=${encodeURIComponent(
            q
          )}`,
          { headers: { Accept: 'application/json' } }
        );
        const data: Suggest[] = await r.json();
        setSuggests(data);
        setActive(0);
      } catch {
        setSuggests([]);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [query, city]);

  // выбрать подсказку
  async function pick(s: Suggest) {
    const lat = parseFloat(s.lat);
    const lon = parseFloat(s.lon);
    await placePoint(lat, lon, false, s.display_name);
    setQuery(s.display_name);
    setSuggests([]);
  }

  // поставить точку + (опционально) реверс-геокод
  async function placePoint(lat: number, lon: number, doReverse = false, presetAddr?: string) {
    markerRef.current?.setLatLng([lat, lon]);
    instanceRef.current?.map?.panTo([lat, lon]);

    let address = presetAddr ?? '';
    if (doReverse && !presetAddr) {
      address = await reverseGeocode(lat, lon);
      if (address) setQuery(address);
    }
    onChange?.({ lat, lon, address });
  }

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

  // клавиатурная навигация по списку
  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!suggests.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i) => (i + 1) % suggests.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => (i - 1 + suggests.length) % suggests.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      pick(suggests[active]);
    } else if (e.key === 'Escape') {
      setSuggests([]);
    }
  }

  return (
    <div className="mt-4">
      {/* Поиск адреса */}
      <div className="relative">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={`Начните вводить адрес… (${city})`}
          className="w-full rounded-xl border px-3 py-2"
        />
        {!!suggests.length && (
          <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-xl border bg-white shadow">
            {suggests.map((s, i) => (
              <button
                key={`${s.lat}-${s.lon}-${i}`}
                type="button"
                onClick={() => pick(s)}
                className={`block w-full text-left px-3 py-2 ${
                  i === active ? 'bg-gray-100' : 'hover:bg-gray-50'
                }`}
              >
                {s.display_name}
              </button>
            ))}
          </div>
        )}
        {loading && (
          <div className="absolute right-3 top-2.5 text-xs text-gray-500">ищем…</div>
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
