// app/page.tsx
import Link from 'next/link';
import dynamic from 'next/dynamic';

export const revalidate = 0;

// динамический импорт карты без SSR
import dynamic from 'next/dynamic';
const MapWithMasters = dynamic(() => import('../components/map/MapWithMasters'), { ssr: false });

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* ШАПКА: сетка из 3 колонок, чтобы бренд был строго по центру */}
      <header className="sticky top-0 z-40 w-full border-b border-zinc-800 bg-zinc-950/70 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 grid grid-cols-3 items-center">
          {/* слева — Услуги */}
          <div className="flex items-center">
            <a
              href="#services"
              className="inline-flex items-center rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 px-3 py-1.5 text-sm font-medium text-white shadow-md hover:opacity-90 active:scale-95 transition"
            >
              Услуги
            </a>
          </div>

          {/* центр — бренд маленькими буквами */}
          <div className="text-center">
            <Link href="/" className="font-semibold tracking-tight text-lg">
              делов-на-час
            </Link>
          </div>

          {/* справа — Вызвать мастера на отдельную страницу /order */}
          <div className="flex justify-end">
            <Link
              href="/order"
              className="inline-flex items-center rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 px-3 py-1.5 text-sm font-medium text-white shadow-md hover:opacity-90 active:scale-95 transition"
            >
              Вызвать мастера
            </Link>
          </div>
        </div>
      </header>

      {/* ГЕРО-СЕКЦИЯ (минималистично, центрировано) */}
      <section className="mx-auto max-w-2xl px-4 py-10 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold leading-tight">
          Мастер на час и отделочные работы в Калуге
        </h1>

        {/* компактные инфо-баннеры, 3–4 шт, с закруглением */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {['Фикс-цена', 'Быстрый выезд', 'Гарантия', 'Чисто и в срок'].map((t) => (
            <div
              key={t}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/50 px-3 py-3 text-sm shadow-sm"
            >
              {t}
            </div>
          ))}
        </div>

        {/* зелёные индикаторы в одну линию, оставляем только нужные */}
        <div className="mt-6 flex items-center justify-center gap-6 text-sm text-zinc-300">
          {['Фикс-цена до выезда', 'Приоритет по подписке', 'Оплата на месте'].map(
            (label) => (
              <div key={label} className="flex items-center gap-2">
                <span className="relative inline-flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-30 animate-ping" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
                </span>
                {label}
              </div>
            ),
          )}
        </div>

        {/* Кнопки в одну линию */}
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link
            href="/order"
            className="inline-flex items-center rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 px-5 py-3 font-medium text-white shadow-lg hover:opacity-90 active:scale-95 transition"
          >
            Рассчитать и вызвать
          </Link>
          <a
            href="#subscription"
            className="inline-flex items-center rounded-2xl bg-zinc-800 px-5 py-3 font-medium text-zinc-100 shadow-inner hover:bg-zinc-700 active:scale-95 transition"
          >
            Оформить подписку
          </a>
        </div>
      </section>

      {/* Превью трекинга мастера — теперь реальная карта */}
      <section id="live-map" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-10">
        <div className="grid lg:grid-cols-2 gap-6 items-start">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-3">
            <MapWithMasters height="360px" />
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div className="rounded-xl bg-zinc-800/60 p-3">
                <div className="text-xs text-zinc-400">Статус</div>
                <div className="font-semibold">Поиск мастера</div>
              </div>
              <div className="rounded-xl bg-zinc-800/60 p-3">
                <div className="text-xs text-zinc-400">ETA</div>
                <div className="font-semibold">3–5 мин</div>
              </div>
              <div className="rounded-xl bg-zinc-800/60 p-3">
                <div className="text-xs text-zinc-400">Мастер</div>
                <NameTicker />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Услуги */}
      <section id="services" className="py-12 border-t border-zinc-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-semibold mb-6">Популярные услуги</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { t: 'Электрика', d: 'Розетки, выключатели, светильники, автоматы' },
              { t: 'Сантехника', d: 'Смесители, унитазы, протечки, подключение техники' },
              { t: 'Сборка и мелкий ремонт', d: 'Мебель, полки, карнизы, ручки' },
              { t: 'Отделка', d: 'Шпаклёвка, штукатурка, покраска, швы' },
              { t: 'Монтаж/демонтаж', d: 'Перегородки, двери, проёмы' },
              { t: 'Диагностика', d: 'Электрика/сантехника, замеры' },
            ].map((c) => (
              <div
                key={c.t}
                className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 hover:border-zinc-700 transition"
              >
                <div className="font-semibold">{c.t}</div>
                <div className="mt-1 text-sm text-zinc-400">{c.d}</div>
                <Link
                  href="/order"
                  className="mt-4 inline-flex rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-2 text-sm text-white shadow hover:opacity-90 active:scale-95 transition"
                >
                  Рассчитать
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Подписка */}
      <section id="subscription" className="py-12 border-t border-zinc-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-semibold mb-6">Подписка</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { t: 'Базовая', d: 'Приоритетный выезд, скидка на работы' },
              { t: 'Стандарт', d: 'Расширенный перечень, расходники' },
              { t: 'Премиум', d: 'Максимум включений, SLA по времени' },
            ].map((p) => (
              <div key={p.t} className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
                <div className="font-semibold">{p.t}</div>
                <div className="mt-1 text-sm text-zinc-400">{p.d}</div>
                <div className="mt-4 flex gap-2">
                  <a className="inline-flex rounded-xl bg-zinc-800 px-4 py-2 text-sm hover:bg-zinc-700 transition">
                    Подробнее
                  </a>
                  <Link
                    href="/order"
                    className="inline-flex rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-2 text-sm text-white shadow hover:opacity-90 active:scale-95 transition"
                  >
                    Оставить заявку
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

/** Простая «карусель» имён мастеров */
function NameTicker() {
  const names = ['Саша · ★4.9', 'Олег · ★4.8', 'Игорь · ★4.7', 'Максим · ★5.0'];
  return (
    <span className="inline-block animate-pulse">{names[new Date().getSeconds() % names.length]}</span>
  );
}
