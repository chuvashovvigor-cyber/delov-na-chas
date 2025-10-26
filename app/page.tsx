// app/page.tsx
import Hero from "./components/Hero";

export const revalidate = 0;

export default function Page() {
  return (
    <main className="min-h-screen">
      {/* HERO 16:9 с градиентом и персонажем */}
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <Hero />
      </div>

      {/* дальше идёт твой контент страницы */}
      {/* ... */}
    </main>
  );
}
import Link from "next/link";
import dynamic from "next/dynamic";


export const revalidate = 0;

// карта мастеров (динамический импорт БЕЗ SSR)
// ВАЖНО: относительный путь, а не "@/..."
const MapWithMasters = dynamic(
  () => import("../components/map/MapWithMasters"),
  { ssr: false }
);

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Шапка */}
      <header className="sticky top-0 z-40 w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* слева */}
          <nav className="flex items-center gap-3 text-sm">
            <Link
              href="#services"
              className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 hover:bg-zinc-800 transition"
            >
              Услуги
            </Link>
          </nav>

          {/* центр */}
          <div className="text-base font-semibold tracking-wide lowercase">
            делов-на-час
          </div>

          {/* справа */}
          <div className="flex items-center gap-2">
            <Link
              href="/order"
              className="rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-1.5 text-white shadow-md hover:shadow-lg active:scale-[0.98] transition"
            >
              Вызвать мастера
            </Link>
          </div>
        </div>
      </header>

      {/* Герой + краткое описание */}
      <section className="bg-gradient-to-b from-zinc-950 to-zinc-900">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-4 py-8 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-12">
          <div className="space-y-5">
            <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
              Мастер на час и отделочные работы в Калуге
            </h1>
            <p className="text-zinc-300">
              Фикс-цены, быстрые заявки, подписки. Живой трекинг мастера — как
              в такси.
            </p>

            {/* Ровная линия индикаторов */}
            <div className="mt-4 flex flex-wrap items-center gap-6 text-sm text-zinc-300">
              {["Фикс-цена до выезда", "Приоритет по подписке", "Оплата на месте"].map(
                (label) => (
                  <div key={label} className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500/60"></span>
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                    </span>
                    {label}
                  </div>
                )
              )}
            </div>

            {/* Кнопки в одну линию */}
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/order"
                className="rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 px-5 py-2 text-white shadow-md hover:shadow-lg active:scale-95 transition"
              >
                Рассчитать и вызвать
              </Link>
              <Link
                href="#subscription"
                className="rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-2 hover:bg-zinc-800 transition"
              >
                Оформить подписку
              </Link>
            </div>
          </div>

          {/* Превью трекинга + сетка карточек */}
          <div className="space-y-3">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
              {/* ЖИВАЯ карта */}
              <MapWithMasters height="360px" />

              {/* Статусы под картой */}
              <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-3">
                  <div className="text-xs text-zinc-400">Статус</div>
                  <div className="font-semibold">Поиск мастера</div>
                </div>
                <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-3">
                  <div className="text-xs text-zinc-400">ETA</div>
                  <div className="font-semibold">3–5 мин</div>
                </div>
                <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-3">
                  <div className="text-xs text-zinc-400">Мастер</div>
                  <div className="font-semibold">Саша · Илья · Антон</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Услуги (якорь для кнопки в шапке) */}
      <section id="services" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h2 className="mb-4 text-2xl font-bold">Популярные услуги</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { t: "Электрика", d: "Розетки, выключатели, светильники" },
            { t: "Сантехника", d: "Смесители, унитазы, протечки" },
            { t: "Сборка/мелкий ремонт", d: "Мебель, полки, карнизы" },
          ].map((c) => (
            <div
              key={c.t}
              className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 transition hover:shadow-lg"
            >
              <div className="font-semibold">{c.t}</div>
              <div className="mt-1 text-sm text-zinc-300">{c.d}</div>
              <Link
                href="/order"
                className="mt-4 inline-flex rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-2 text-white shadow hover:shadow-lg active:scale-95 transition"
              >
                Рассчитать
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Подписка */}
      <section id="subscription" className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <h2 className="mb-4 text-2xl font-bold">Подписка</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {["Базовая", "Стандарт", "Премиум"].map((title) => (
            <div
              key={title}
              className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5"
            >
              <div className="font-semibold">{title}</div>
              <div className="mt-1 text-sm text-zinc-300">
                Приоритет, скидки и расширенные включения.
              </div>
              <div className="mt-4 flex gap-3">
                <button className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2 hover:bg-zinc-800 transition">
                  Подробнее
                </button>
                <Link
                  href="/order"
                  className="rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-2 text-white shadow hover:shadow-lg active:scale-95 transition"
                >
                  Оставить заявку
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
