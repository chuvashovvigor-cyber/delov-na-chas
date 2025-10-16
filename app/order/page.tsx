'use client';

import { useState } from 'react';
import OrderClient from './OrderClient';

type Preview = { name: string; url: string; type: string };
type Point = { lat: number; lon: number; address?: string };

export default function OrderPage() {
  const [files, setFiles] = useState<Preview[]>([]);
  const [point, setPoint] = useState<Point>({
    lat: 54.513845,
    lon: 36.261215,
    address: '',
  });

  function onPickFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const f = Array.from(e.target.files ?? []);
    const previews = f.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
      type: file.type,
    }));
    setFiles(previews);
  }

  // демо-мастера (потом сюда будем подставлять реальные координаты из Telegram)
  const masters = [
    { lat: 54.5205, lon: 36.27, name: 'Сергей' },
    { lat: 54.50, lon: 36.24, name: 'Алексей' },
  ];

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
          {/* ФОРМА */}
          <section>
            <h1 className="text-3xl sm:text-4xl font-bold leading-tight">
              Вызвать мастера
            </h1>
            <p className="mt-3 text-gray-600">
              Укажите адрес (поиск с подсказками), прикрепите фото/видео и отправьте заявку.
            </p>

            <form
              method="post"
              action="/api/order"
              encType="multipart/form-data"
              className="mt-8 grid gap-3 max-w-xl"
            >
              <input name="name" required placeholder="Ваше имя" className="rounded-xl border px-3 py-2" />
              <input name="phone" required placeholder="Телефон" className="rounded-xl border px-3 py-2" />
              {/* адрес — синхронизируем с картой через hidden */}
              <input
                name="address"
                placeholder="Адрес (если пусто — возьмём с карты)"
                className="rounded-xl border px-3 py-2"
                value={point.address || ''}
                onChange={(e) => setPoint((p) => ({ ...p, address: e.target.value }))}
              />
              <textarea name="details" required placeholder="Опишите задачу" rows={4} className="rounded-xl border px-3 py-2" />

              {/* скрытые координаты */}
              <input type="hidden" name="lat" value={point.lat} />
              <input type="hidden" name="lon" value={point.lon} />

              {/* Загрузка медиа + предпросмотр */}
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

          {/* ПРАВАЯ КОЛОНКА: поиск + карта + мастера */}
          <aside className="rounded-3xl border bg-white p-4 shadow-sm">
            <div className="text-sm font-semibold mb-3">Город</div>
            <select className="w-full rounded-xl border px-3 py-2 bg-white">
              <option value="kaluga">Калуга</option>
            </select>

            {/* Поиск + карта + кликабельная/перетаскиваемая метка.
                onChange отдаёт lat/lon/address и мы держим это в state,
                а в форму прокидываем через hidden поля */}
            <OrderClient
              value={point}
              onChange={(p) => setPoint(p)}
              masters={masters}
            />

            <div className="mt-4 text-sm text-gray-600">
              Кликните по карте или перетащите метку — адрес подставится автоматически.
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
