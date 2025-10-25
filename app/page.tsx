// app/page.tsx
import dynamic from 'next/dynamic';

import ThemeToggle from '../components/ui/ThemeToggle';
import NameTicker from '../components/ui/NameTicker';

// карта мастеров (динамический импорт без SSR)
const MapWithMasters = dynamic(
  () => import('../components/map/MapWithMasters'),
  { ssr: false }
);

export const revalidate = 0;

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-zinc-950 dark:text-zinc-100">
      {/* ШАПКА */}
      <header className="sticky top-0 z-40 w-full backdrop-blur bg-white/80 dark:bg-zinc-900/70 border-b border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 grid grid-cols-3 items-center">
          {/* слева */}
          <div className="justify-self-start">
            <a
              href="#services"
              className="rounded-xl px-3 py-2 text-sm font-medium bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow hover:shadow-md active:scale-[.98] transition"
            >
              Услуги
            </a>
          </div>

          {/* центр */}
          <div className="justify-self-center font-semibold lowercase">
            делов-на-час
          </div>

          {/* справа */}
          <div className="justify-self-end flex items-center gap-2">
            <ThemeToggle />
            <a
              href="#order"
              className="rounded-xl px-3 py-2 text-sm font-medium bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow hover:shadow-md active:scale-[.98] transition"
            >
              Вызвать мастера
            </a>
          </div>
        </div>
      </header>

      {/* ХИРО */}
      <section className="bg-gradient-to-b from-white to-gray-50 dark:from-zinc-950 dark:to-zinc-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 lg:py-14 grid lg:grid-cols-2 gap-8 items-center">
          <div className="text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
              Мастер на час и отделочные работы в Калуге
            </h1>

            {/* зелёные индикаторы в одну линию */}
            <div className="mt-5 flex items-center justify-center lg:justify-start gap-6 text-sm text-gray-600 dark:text-zinc-300">
              {['Фикс-цена до выезда', 'Приоритет по подписке', 'Оплата на месте'].map(
                (label) => (
                  <div key={label} className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.9)]" />
                    </span>
                    {label}
                  </div>
                )
              )}
            </div>

            {/* кнопки в одну линию */}
            <div className="mt-6 flex items-center justify-center lg:justify-start gap-3">
              <a
                href="#order"
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow hover:shadow-lg active:scale-[.98] transition"
              >
                Рассчитать и вызвать
              </a>
              <a
                href="#subscription"
                className="px-5 py-3 rounded-2xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700 shadow-sm active:scale-[.98] transition"
              >
                Оформить подписку
              </a>
            </div>
          </div>

          {/* превью карточка с мини-картой */}
          <div className="relative">
            <div className="rounded-3xl border bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 p-4 shadow-sm">
              {/* тут была заглушка — теперь настоящая мини-карта */}
              <div className="aspect-[16/10] w-full overflow-hidden rounded-2xl">
                <MapWithMasters height="100%" />
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                <div className="rounded-xl bg-gray-50 dark:bg-zinc-800 p-3 border border-zinc-200 dark:border-zinc-700">
                  <div className="text-xs text-gray-500 dark:text-zinc-400">Статус</div>
                  <div className="font-semibold">Поиск мастера</div>
                </div>
                <div className="rounded-xl bg-gray-50 dark:bg-zinc-800 p-3 border border-zinc-200 dark:border-zinc-700">
                  <div className="text-xs text-gray-500 dark:text-zinc-400">ETA</div>
                  <div className="font-semibold">3–5 мин</div>
                </div>
                <div className="rounded-xl bg-gray-50 dark:bg-zinc-800 p-3 border border-zinc-200 dark:border-zinc-700">
                  <div className="text-xs text-gray-500 dark:text-zinc-400">Мастер</div>
                  <div className="font-semibold">
                    <NameTicker names={['Саша', 'Игорь', 'Максим', 'Антон']} /> · ★4.9
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* НОВАЯ СЕКЦИЯ: ЖИВАЯ КАРТА МАСТЕРОВ */}
      <section id="live-map" className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-4">Мастера рядом</h2>
          <div className="rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
            <MapWithMasters height="420px" />
          </div>
        </div>
      </section>

      {/* НИЖЕ оставь свои секции услуг/кейсов/подписок/формы как было */}
    </div>
  );
}
