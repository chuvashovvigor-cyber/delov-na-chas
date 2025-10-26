// app/page.tsx
import Link from "next/link";
import dynamic from "next/dynamic";
import Hero from "./components/Hero";

export const revalidate = 0;

// карта мастеров (динамический импорт без SSR)
const MapWithMasters = dynamic(() => import("@/components/map/MapWithMasters"), {
  ssr: false,
});

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* ─────────────────────────── ШАПКА ─────────────────────────── */}
      <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-7xl h-14 px-3 sm:px-4 lg:px-8 relative">
          {/* левая кнопка (Услуги) */}
          <div className="absolute left-3 top-1/2 -translate-y-1/2 sm:left-4">
            <Link
              href="#services"
              className="h-9 px-3 inline-flex items-center justify-center rounded-xl text-sm
                         bg-white text-gray-900 border shadow-sm hover:bg-gray-100 active:scale-[0.98] transition"
            >
              Услуги
            </Link>
          </div>

          {/* центр — бренд */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <span className="font-semibold tracking-tight lowercase select-none">
              делов-на-час
            </span>
          </div>

          {/* правая кнопка (Вызвать мастера) */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 sm:right-4">
            <Link
              href="/order"
              className="h-9 px-3 inline-flex items-center justify-center rounded-xl text-sm text-white
                         bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600
                         shadow-md active:scale-[0.98] transition"
            >
              Вызвать мастера
            </Link>
          </div>
        </div>
      </header>

      {/* ─────────────────────────── HERO ─────────────────────────── */}
      <main>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <Hero />
        </div>

        {/* ───────────────────── Наши преимущества ─────────────────── */}
        <section className="py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-semibold mb-4">Наши преимущества</h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {[
                "Фикс-цены до выезда",
                "Приоритет по подписке",
                "Живая карта мастера",
                "Оплата на месте",
              ].map((t) => (
                <div
                  key={t}
                  className="rounded-2xl border bg-white p-4 text-sm shadow-sm hover:shadow transition"
                >
                  {t}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ───────────────────── Живая карта мастеров ──────────────── */}
        <section id="live-map" className="py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-semibold mb-4">Мастера рядом</h2>

            {/* Внутри MapWithMasters сама карта Leaflet; даём ей высоту */}
            <div className="rounded-2xl border bg-white p-3">
              <MapWithMasters height="420px" />
            </div>

            <div className="mt-3 grid grid-cols-3 gap-3 text-sm">
              <div className="rounded-xl bg-gray-50 p-3 border">
                <div className="text-xs text-gray-500">Статус</div>
                <div className="font-semibold">Поиск мастера</div>
              </div>
              <div className="rounded-xl bg-gray-50 p-3 border">
                <div className="text-xs text-gray-500">ETA</div>
                <div className="font-semibold">3–5 мин</div>
              </div>
              <div className="rounded-xl bg-gray-50 p-3 border">
                <div className="text-xs text-gray-500">Мастер</div>
                <div className="font-semibold">Саша · Игорь · Антон</div>
              </div>
            </div>
          </div>
        </section>

        {/* ───────────────────── Популярные услуги ─────────────────── */}
        <section id="services" className="py-10 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-semibold">Популярные услуги</h2>

            <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { t: "Электрика", d: "Розетки, выключатели, светильники" },
                { t: "Сантехника", d: "Смесители, унитазы, протечки" },
                { t: "Сборка/мелкий ремонт", d: "Мебель, полки, карнизы" },
                { t: "Отделка", d: "Шпаклёвка, покраска, армирование" },
                { t: "Монтаж/демонтаж", d: "Проёмы, двери, перегородки" },
                { t: "Диагностика", d: "Электрика/сантехника, замеры" },
              ].map((c) => (
                <div
                  key={c.t}
                  className="rounded-2xl border bg-white p-5 hover:shadow-sm transition"
                >
                  <div className="font-semibold">{c.t}</div>
                  <div className="mt-1 text-sm text-gray-600">{c.d}</div>
                  <Link
                    href="/order"
                    className="mt-4 inline-flex rounded-xl px-4 py-2 text-white text-sm
                               bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600
                               shadow-md active:scale-[0.98] transition"
                  >
                    Рассчитать и заказать
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ───────────────────── Форма заявки якорь ────────────────── */}
        <section id="order" className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-semibold text-center">
              Готовы помочь сегодня
            </h2>
            <p className="mt-2 text-gray-600 text-center">
              Опишите задачу — заявка прилетит в наш Telegram-чат.
            </p>

            <form
              method="post"
              action="/api/order"
              encType="multipart/form-data"
              className="mx-auto mt-8 max-w-xl grid gap-3"
            >
              <input
                name="name"
                required
                placeholder="Ваше имя"
                className="rounded-xl border px-3 py-2"
              />
              <input
                name="phone"
                required
                placeholder="Телефон"
                className="rounded-xl border px-3 py-2"
              />
              <input
                name="address"
                placeholder="Адрес (необязательно)"
                className="rounded-xl border px-3 py-2"
              />
              <textarea
                name="details"
                required
                placeholder="Опишите задачу"
                rows={4}
                className="rounded-xl border px-3 py-2"
              />

              <div className="grid gap-2">
                <input
                  id="media"
                  name="media"
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  className="hidden"
                />
                <label
                  htmlFor="media"
                  className="cursor-pointer rounded-2xl border border-dashed bg-white px-4 py-3 text-center hover:bg-gray-50"
                >
                  <div className="text-sm font-medium">
                    Прикрепить фото/видео
                  </div>
                  <div className="text-xs text-gray-500">
                    Можно несколько файлов • до ~20 МБ каждый
                  </div>
                </label>
              </div>

              <button
                className="rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3
                           hover:from-blue-600 hover:to-indigo-600 shadow-md active:scale-[0.98] transition"
              >
                Отправить заявку
              </button>

              <p className="text-xs text-gray-500">
                Отправляя заявку, вы соглашаетесь с условиями обработки
                персональных данных.
              </p>
            </form>
          </div>
        </section>
      </main>

      {/* ─────────────────────────── ФУТЕР ─────────────────────────── */}
      <footer id="contacts" className="border-t bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 grid md:grid-cols-3 gap-6 text-sm">
          <div>
            <div className="font-semibold">Контакты</div>
            <div className="mt-2 text-gray-600">
              +7 (xxx) xxx-xx-xx
              <br />
              info@example.ru
            </div>
          </div>
          <div>
            <div className="font-semibold">Реквизиты</div>
            <div className="mt-2 text-gray-600">
              ИП Чувашов Геннадий Валентинович
              <br />
              ИНН 402900754277 · ОГРНИП 325400000013867
              <br />
              Калужская обл., г. Калуга
            </div>
          </div>
          <div>
            <div className="font-semibold">Документы</div>
            <div className="mt-2 text-gray-600">
              Публичная оферта · Политика · Согласие на ПДн
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
