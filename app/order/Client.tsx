// app/order/Client.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import L from "leaflet";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

type LatLng = [number, number];

const KALUGA_CENTER: LatLng = [54.513845, 36.261215];

// Чёрная красивая метка (SVG)
const blackPin = L.icon({
  iconUrl:
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="black"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/></svg>',
  iconSize: [28, 28],
  iconAnchor: [14, 28],
});

function DraggableMarker({
  position,
  setPosition,
}: {
  position: LatLng;
  setPosition: (p: LatLng) => void;
}) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return (
    <Marker
      position={position}
      draggable
      icon={blackPin}
      eventHandlers={{
        dragend: (e) => {
          const m = e.target as L.Marker;
          const p = m.getLatLng();
          setPosition([p.lat, p.lng]);
        },
      }}
    />
  );
}

export default function Client() {
  // НИКАКИХ пропсов, только локальное состояние
  const [city, setCity] = useState("Калуга");
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<
    { display_name: string; lat: string; lon: string }[]
  >([]);
  const [openSugg, setOpenSugg] = useState(false);
  const [pos, setPos] = useState<LatLng>(KALUGA_CENTER);
  const [address, setAddress] = useState("");

  // живой поиск Nominatim c дебаунсом
  useEffect(() => {
    const t = setTimeout(async () => {
      const q = query.trim();
      if (q.length < 2) {
        setSuggestions([]);
        setOpenSugg(false);
        return;
      }
      try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&limit=6&q=${encodeURIComponent(
          `${q} ${city}`
        )}`;
        const r = await fetch(url, {
          headers: {
            Accept: "application/json",
            "User-Agent": "delov-na-chas/1.0",
          },
        });
        const data = (await r.json()) as any[];
        setSuggestions(
          data.map((d) => ({
            display_name: d.display_name as string,
            lat: d.lat as string,
            lon: d.lon as string,
          }))
        );
        setOpenSugg(true);
      } catch {
        setSuggestions([]);
        setOpenSugg(false);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [query, city]);

  function pickSuggestion(s: { display_name: string; lat: string; lon: string }) {
    const lat = parseFloat(s.lat);
    const lon = parseFloat(s.lon);
    setPos([lat, lon]);
    setQuery(s.display_name);
    setAddress(s.display_name);
    setOpenSugg(false);
  }

  const tiles = useMemo(
    () =>
      "https://{s}.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}{r}.png",
    []
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="sticky top-0 z-40 w-full backdrop-blur bg-white/80 border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-gray-900" />
            <a href="/" className="font-semibold">Делов-на-час</a>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="/#services" className="hover:text-gray-700">Услуги</a>
            <a href="/#how" className="hover:text-gray-700">Как это работает</a>
            <a href="/#subscription" className="hover:text-gray-700">Подписка</a>
            <a href="/#cases" className="hover:text-gray-700">Кейсы</a>
            <a href="/#contacts" className="hover:text-gray-700">Контакты</a>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Форма */}
          <section>
            <h1 className="text-3xl sm:text-4xl font-bold leading-tight">Вызвать мастера</h1>
            <p className="mt-3 text-gray-600">Опишите задачу — заявка улетит в наш Telegram-чат.</p>

            <form method="post" action="/api/order" encType="multipart/form-data" className="mt-8 grid gap-3 max-w-xl">
              <input name="name" required placeholder="Ваше имя" className="rounded-xl border px-3 py-2" />
              <input name="phone" required placeholder="Телефон" className="rounded-xl border px-3 py-2" />
              <input
                name="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Адрес (необязательно)"
                className="rounded-xl border px-3 py-2"
              />
              <textarea name="details" required placeholder="Опишите задачу" rows={4} className="rounded-xl border px-3 py-2" />

              <div className="grid gap-2">
                <input id="media" name="media" type="file" multiple accept="image/*,video/*" className="hidden" />
                <label htmlFor="media" className="cursor-pointer rounded-2xl border border-dashed bg-white px-4 py-3 text-center hover:bg-gray-50">
                  <div className="text-sm font-medium">Прикрепить фото/видео</div>
                  <div className="text-xs text-gray-500">Можно несколько файлов • до ~20 МБ каждый</div>
                </label>
              </div>

              <button className="rounded-2xl bg-gray-900 text-white py-3 hover:bg-black">Отправить заявку</button>

              <input type="hidden" name="lat" value={pos[0]} />
              <input type="hidden" name="lon" value={pos[1]} />
            </form>
          </section>

          {/* Город, поиск, карта */}
          <aside className="rounded-3xl border bg-white p-4 shadow-sm">
            <div className="text-sm font-semibold mb-2">Город</div>
            <select className="w-full rounded-xl border px-3 py-2 bg-white" value={city} onChange={(e) => setCity(e.target.value)}>
              <option value="Калуга">Калуга</option>
            </select>

            <div className="mt-4">
              <div className="text-sm font-semibold mb-2">Адрес/поиск</div>

              {/* ВАЖНО: relative/z-index, чтобы список был НАД картой */}
              <div className="relative z-20">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Начните вводить адрес или место…"
                  className="w-full rounded-xl border px-3 py-2"
                />
                {openSugg && suggestions.length > 0 && (
                  <div className="absolute left-0 right-0 mt-1 rounded-xl border bg-white shadow-lg max-h-60 overflow-auto z-30">
                    {suggestions.map((s, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => pickSuggestion(s)}
                        className="block w-full text-left px-3 py-2 hover:bg-gray-50 text-sm"
                      >
                        {s.display_name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 relative z-10">
              <div className="rounded-2xl overflow-hidden border">
                <MapContainer center={pos} zoom={16} scrollWheelZoom className="h-[340px] w-full z-0">
                  <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}{r}.png"
                    attribution="&copy; OpenStreetMap & CARTO"
                  />
                  <DraggableMarker position={pos} setPosition={(p) => setPos(p)} />
                </MapContainer>
              </div>
              <div className="text-xs text-gray-500 mt-2">
                Кликните по карте или перетащите метку — координаты подставятся автоматически.
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
