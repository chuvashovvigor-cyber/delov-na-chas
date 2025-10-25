// app/page.tsx
import dynamic from "next/dynamic";

export const revalidate = 0;

// ⬇️ Импорты строго относительными путями из /app
const ThemeToggle    = dynamic(() => import("./components/ui/ThemeToggle"), { ssr: false });
const NameTicker     = dynamic(() => import("./components/ui/NameTicker"), { ssr: false });
const MapWithMasters = dynamic(() => import("./components/map/MapWithMasters"), { ssr: false });

// общие классы для градиентных кнопок
const btn =
  "inline-flex items-center justify-center rounded-2xl px-5 py-3 font-medium text-white " +
  "bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 " +
  "shadow-[0_10px_20px_rgba(59,130,246,.25)] " +
  "transition-all duration-200 hover:shadow-[0_14px_28px_rgba(59,130,246,.35)] hover:-translate-y-0.5 active:translate-y-0 " +
  "focus:outline-none focus:ring-2 focus:ring-blue-400/60";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 transition-colors duration-300 dark:bg-gray-950 dark:text-gray-100">
      {/* HEADER */}
      <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur transition-colors duration-300 dark:border-gray-800 dark:bg-gray-900/70">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="min-w-0">
            <a href="#services" className={`${btn} px-4 py-2 text-sm`}>Услуги</a>
          </div>
          <div className="pointer-events-none absolute inset-x-0 mx-auto w-full max-w-7xl">
            <div className="flex h-16 items-center justify-center">
              <span className="pointer-events-auto select-none text-base font-semibold tracking-wide lowercase">
                делов-на-час
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <a href="#order" className={`${btn} px-4 py-2 text-sm`}>Вызвать мастера</a>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="bg-gradient-to-b from-white to-gray-50 py-8 transition-colors duration-300 dark:from-gray-950 dark:to-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* инфо-баннеры */}
          <div className="mx-auto grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-16 rounded-2xl border bg-white/80 shadow-sm transition-all duration-200 hover:shadow-md dark:border-gray-800 dark:bg-gray-900/80"
              />
            ))}
          </div>

          {/* заголовок */}
          <div className="mx-auto mt-8 max-w-3xl text-center">
            <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
              Мастер на час и отделочные работы в Калуге
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-balance text-gray-600 dark:text-gray-300">
              Фикс-цены, быстрые заявки, подписки для частных лиц и бизнеса. Живой трекинг мастера — как в такси.
            </p>

            {/* индикаторы (ровно, в линию) */}
            <div className="mx-auto mt-5 flex w-full max-w-md items-center justify-center gap-6 text-sm text-gray-600 dark:text-gray-300">
              {["Фикс-цена до выезда", "Приоритет по подписке"].map((label) => (
                <div key={label} className="flex items-center gap-2">
                  <span className="relative inline-flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,.8)]" />
                  </span>
                  {label}
                </div>
              ))}
            </div>

            {/* две кнопки в линию */}
            <div className="mx-auto mt-6 flex w-full max-w-md items-center justify-center gap-3">
              <a href="#order" className={btn}>Рассчитать и вызвать</a>
              <a href="#subscription" className={btn}>Оформить подписку</a>
            </div>
          </div>

          {/* превью карты */}
          <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border bg-white/80 p-4 shadow-sm transition dark:border-gray-800 dark:bg-gray-900/70">
              <div className="overflow-hidden rounded-2xl">
                <MapWithMasters height="260px" />
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                <div className="rounded-xl border bg-white/85 p-3 dark:border-gray-800 dark:bg-gray-900/70">
                  <div className="text-xs text-gray-500 dark:text-gray-400">Статус</div>
                  <div className="font-semibold">Поиск мастера</div>
                </div>
                <div className="rounded-xl border bg-white/85 p-3 dark:border-gray-800 dark:bg-gray-900/70">
                  <div className="text-xs text-gray-500 dark:text-gray-400">ETA</div>
                  <div className="font-semibold">3–5 мин</div>
                </div>
                <div className="rounded-xl border bg-white/85 p-3 dark:border-gray-800 dark:bg-gray-900/70">
                  <div className="text-xs text-gray-500 dark:text-gray-400">Мастер</div>
                  <div className="font-semibold">
                    <NameTicker names={["Саша", "Игорь", "Михаил", "Дмитрий", "Андрей"]} />
                  </div>
                </div>
              </div>
            </div>

            {/* мини-калькулятор */}
            <div className="rounded-3xl border bg-white/80 p-4 shadow-sm transition dark:border-gray-800 dark:bg-gray-900/70">
              <div className="text-sm font-semibold">Мини-калькулятор</div>
              <div className="mt-3 grid gap-2">
                <select className="w-full rounded-xl border bg-white/90 px-3 py-2 dark:border-gray-800 dark:bg-gray-900">
                  <option>Выберите категорию</option>
                  <option>Электрика</option>
                  <option>Сантехника</option>
                  <option>Сборка</option>
                  <option>Отделка</option>
                  <option>Демонтаж</option>
                </select>
                <input className="w-full rounded-xl border bg-white/90 px-3 py-2 dark:border-gray-800 dark:bg-gray-900" placeholder="Что сделать?" />
                <input className="w-full rounded-xl border bg-white/90 px-3 py-2 dark:border-gray-800 dark:bg-gray-900" placeholder="Кол-во / м²" />
                <button className={btn}>Рассчитать</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ниже секции (доверяют/услуги/подписка/форма/футер) — оставляю как в предыдущем варианте */}
      {/* ... */}
    </div>
  );
}
