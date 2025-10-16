// app/order/OrderClient.tsx
'use client';

import { useEffect, useRef, useState } from 'react';

type Preview = { name: string; url: string; type: string };
type Coords = { lat: number; lon: number };

const KALUGA_CENTER: Coords = { lat: 54.514, lon: 36.261 };

export default function OrderClient() {
  // форма
  const [city, setCity] = useState('Калуга');
  const [address, setAddress] = useState('');
  const [coords, setCoords] = useState<Coords | null>(null);
  const [files, setFiles] = useState<Preview[]>([]);

  // карта
  const mapDivRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  // загрузка css для leaflet
  useEffect(() => {
    const id = 'leaflet-css';
    if (!document.getElementById(id)) {
      const link = document.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }
  }, []);

  // инициализация карты
  useEffect(() => {
    (async () => {
      if (!mapDivRef.current || mapRef.current) return;

      // подгрузим сам leaflet на клиенте
      const L = await import('leaflet');

      // фикс путей к иконкам
      const icon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });

      const map = L.map(mapDivRef.current).setView([KALUGA_CENTER.lat, KALUGA_CENTER.lon], 13);
      mapRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
      }).addTo(map);

      // клик по карте — ставим маркер и реверс-геокодим
      map.on('click', async (e: any) => {
        const lat = e.latlng.lat as number;
        const lon = e.latlng.lng as number;

        if (!markerRef.current) {
          markerRef.current = L.marker([lat, lon], { icon }).addTo(map);
        } else {
          markerRef.current.setLatLng([lat, lon]);
        }

        setCoords({ lat, lon });

        // обратный геокодинг (Nominatim)
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=ru`
          );
          const json = await res.json();
          if (json?.display_name) setAddress(json.display_name as string);
        } catch {
          /* ignore */
        }
      });
    })();
  }, []);

  async function geocodeByText(q: string) {
    if (!q.trim()) return;
    const full = `${city}, ${q}`;
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          full
        )}&limit=1&accept-language=ru`
      );
      const arr = await res.json();
      if (arr?.[0]) {
        const lat = parseFloat(arr[0].lat);
        const lon = parseFloat(arr[0].lon);
        moveMarkerTo({ lat, lon });
        setAddress(arr[0].display_name || full);
      }
    } catch {
      /* ignore */
    }
  }

  async function moveMarkerTo({ lat, lon }: Coords) {
    const L = await import('leaflet');
    if (!mapRef.current) return;
    const map = mapRef.current as any;

    map.setView([lat, lon], 15);

    if (!markerRef.current) {
      markerRef.current = L.marker([lat, lon]).addTo(map);
    } else {
      markerRef.current.setLatLng([lat, lon]);
    }
    setCoords({ lat, lon });
  }

  function onPickFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const f = Array.from(e.target.files ?? []);
    const previews = f.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
      type: file.type,
    }));
    setFiles(previews);
  }

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
          <section>
            <h1 className="text-3xl sm:text-4xl font-bold leading-tight">Вызвать мастера</h1>
            <p className="mt-3 text-gray-600">Выберите адрес (клик по карте или поиск), опишите задачу и прикрепите фото/видео.</p>

            <form
              method="post"
              action="/api/order"
              encType="multipart/form-data"
              className="mt-8 grid gap-3 max-w-xl"
            >
              {/* город и адрес */}
              <input type="hidden" name="city" value={city} />
              <div className="grid gap-1">
                <label className="text-sm text-gray-600">Адрес</label>
                <div className="flex gap-2">
                  <input
                    name="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Начните вводить адрес или кликните по карте"
                    className="flex-1 rounded-xl border px-3 py-2"
                  />
                  <button
                    type="button"
                    onClick={() => geocodeByText(address)}
                    className="rounded-xl bg-gray-900 text-white px-4 hover:bg-black"
                  >
                    Найти
                  </button>
                </div>
              </div>

              {/* координаты (если выбраны на карте) */}
              <input type="hidden" name="lat" value={coords?.lat ?? ''} />
              <input type="hidden" name="lon" value={coords?.lon ?? ''} />

              <input name="name" required placeholder="Ваше имя" className="rounded-xl border px-3 py-2" />
              <input name="phone" required placeholder="Телефон" className="rounded-xl border px-3 py-2" />
              <textarea name="details" required placeholder="Опишите задачу" rows={4} className="rounded-xl border px-3 py-2" />

              {/* медиа */}
              <div className="grid gap-2">
                <input
                  id="media"
                  name="media"
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  className="hidden"
                  onChange={onPickFiles}
                />
                <label
                  htmlFor="media"
                  className="cursor-pointer rounded-2xl border border-dashed bg-white px-4 py-3 text-center hover:bg-gray-50"
                >
                  <div className="text-sm font-medium">Прикрепить фото/видео</div>
                  <div className="text-xs text-gray-500">Можно несколько файлов • до ~20 МБ каждый</div>
                </label>

                {files.length > 0 && (
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {files.map((f, i) => (
                      <div key={i} className="rounded-xl border bg-white overflow-hidden">
                        {f.type.startsWith('image/') ? (
                          <img src={f.url} alt={f.name} className="h-24 w-full object-cover" />
                        ) : (
                          <video src={f.url} className="h-24 w-full object-cover" controls />
                        )}
                        <div className="p-1 text-[11px] truncate text-gray-600">{f.name}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button className="rounded-2xl bg-gray-900 text-white py-3 hover:bg-black">
                Отправить заявку
              </button>

              <p className="text-xs text-gray-500">
                Отправляя заявку, вы соглашаетесь с условиями обработки персональных данных.
              </p>
            </form>
          </section>

          <aside className="grid gap-4">
            <div className="rounded-3xl border bg-white p-4 shadow-sm">
              <div className="text-sm font-semibold mb-3">Город</div>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full rounded-xl border px-3 py-2 bg-white"
              >
                <option>Калуга</option>
              </select>

              <div className="mt-6 text-sm font-semibold">Карта</div>
              <div className="mt-2 rounded-2xl overflow-hidden border">
                <div ref={mapDivRef} style={{ height: 360 }} />
              </div>

              <div className="mt-4 text-sm text-gray-600">
                Нажмите на карту — поставится метка и мы подставим адрес автоматически.
              </div>

              {coords && (
                <div className="mt-2 text-xs text-gray-500">
                  Координаты: {coords.lat.toFixed(6)}, {coords.lon.toFixed(6)}
                </div>
              )}
            </div>

            <div className="text-center text-sm text-gray-500">
              Или свяжитесь напрямую:
              <div className="mt-2 flex flex-col sm:flex-row gap-3 justify-center">
                <a href="https://t.me/delov_na_chas_bot" className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200">
                  Написать в Telegram
                </a>
                <a href="tel:+7XXXXXXXXXX" className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200">
                  Позвонить
                </a>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
