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

            {/* ИНФО-БАННЕРЫ (прямоугольники с закруглениями) */}
            <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {['Гарантия работ', 'Фикс-цены', 'Выезд сегодня', 'Юр/физ лицам'].map((b) => (
                <div
                  key={b}
                  className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-4 py-3 text-center text-sm shadow-sm"
                >
                  {b}
                </div>
              ))}
            </div>

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

      {/* Нам доверяют */}
      <section className="py-8 border-y bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-xs uppercase tracking-wider text-gray-500 dark:text-zinc-400">
            Нам доверяют
          </div>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-6">
            {['ВТБ', 'El Coffee', 'Bla-Bla bar', 'ДК «Арбат»'].map((name) => (
              <div
                key={name}
                className="h-12 rounded-2xl bg-gray-100 dark:bg-zinc-800 grid place-items-center text-gray-600 dark:text-zinc-300 shadow-sm"
              >
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Как это работает */}
      <section id="how" className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold">Как это работает</h2>
          <div className="mt-6 grid sm:grid-cols-3 gap-4">
            {[
              { t: 'Описываете задачу', d: 'Заполняете форму, прикрепляете фото/видео' },
              { t: 'Получаете цену', d: 'Менеджер подтверждает фикс-стоимость' },
              { t: 'Следите на карте', d: 'Мастер едет к вам, виден ETA и статус' },
            ].map((s, i) => (
              <div
                key={i}
                className="rounded-2xl border bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 p-5 shadow-sm"
              >
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white grid place-items-center font-semibold">
                  {i + 1}
                </div>
                <div className="mt-3 font-semibold">{s.t}</div>
                <div className="mt-1 text-gray-600 dark:text-zinc-300 text-sm">{s.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Популярные услуги */}
      <section id="services" className="py-12 bg-white dark:bg-zinc-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold">Популярные услуги</h2>
          <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { t: 'Электрика', d: 'Розетки, выключатели, светильники, автоматы' },
              { t: 'Сантехника', d: 'Смесители, унитазы, протечки, подключение техники' },
              { t: 'Сборка и мелкий ремонт', d: 'Мебель, полки, карнизы, дверные ручки' },
              { t: 'Отделка', d: 'Шпаклёвка, штукатурка, покраска, армирование сеткой' },
              { t: 'Монтаж/демонтаж', d: 'Возведение/ломка стен, проёмы, двери' },
              { t: 'Диагностика', d: 'Электрика/сантехника, замеры, скрытые коммуникации' },
            ].map((c, i) => (
              <div
                key={i}
                className="rounded-2xl border p-5 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:shadow-md transition"
              >
                <div className="font-semibold">{c.t}</div>
                <div className="mt-1 text-sm text-gray-600 dark:text-zinc-300">{c.d}</div>
                <a
                  href="#order"
                  className="mt-4 inline-flex text-sm rounded-xl px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow hover:shadow-lg active:scale-[.98] transition"
                >
                  Рассчитать
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Подписки */}
      <section id="subscription" className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold">Подписка для физ и юр лиц</h2>
          <div className="mt-6 grid md:grid-cols-3 gap-4">
            {[
              { t: 'Базовая', d: 'Приоритетный выезд, скидка на работы' },
              { t: 'Стандарт', d: 'Расширенный перечень, базовые расходники' },
              { t: 'Премиум', d: 'Максимум включений, SLA по времени' },
            ].map((p, i) => (
              <div
                key={i}
                className="rounded-2xl border bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 p-5 shadow-sm"
              >
                <div className="font-semibold">{p.t}</div>
                <div className="mt-1 text-sm text-gray-600 dark:text-zinc-300">{p.d}</div>
                <div className="mt-4 flex gap-2">
                  <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow hover:shadow-lg active:scale-[.98] transition">
                    Оставить заявку
                  </button>
                  <button className="px-4 py-2 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700 shadow-sm active:scale-[.98] transition">
                    Подробнее
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ФОРМА ЗАЯВКИ */}
      <section id="order" className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center">Готовы помочь сегодня</h2>
          <p className="mt-2 text-gray-600 dark:text-zinc-300 text-center">
            Опишите задачу — заявка прилетит в наш Telegram-чат.
          </p>

          <form
            method="post"
            action="/api/order"
            encType="multipart/form-data"
            className="mx-auto mt-8 max-w-xl grid gap-3"
          >
            <input name="name" required placeholder="Ваше имя" className="rounded-xl border px-3 py-2 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800" />
            <input name="phone" required placeholder="Телефон" className="rounded-xl border px-3 py-2 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800" />
            <input name="address" placeholder="Адрес (необязательно)" className="rounded-xl border px-3 py-2 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800" />
            <textarea name="details" required placeholder="Опишите задачу" rows={4} className="rounded-xl border px-3 py-2 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800" />

            <div className="grid gap-2">
              <input id="media" name="media" type="file" multiple accept="image/*,video/*" className="hidden" />
              <label
                htmlFor="media"
                className="cursor-pointer rounded-2xl border border-dashed bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 px-4 py-3 text-center hover:bg-gray-50 dark:hover:bg-zinc-800"
              >
                <div className="text-sm font-medium">Прикрепить фото/видео</div>
                <div className="text-xs text-gray-500 dark:text-zinc-400">Можно несколько файлов • до ~20 МБ каждый</div>
              </label>
            </div>

            <button className="rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 shadow hover:shadow-lg active:scale-[.98] transition">
              Отправить заявку
            </button>

            <p className="text-xs text-gray-500 dark:text-zinc-400">
              Отправляя заявку, вы соглашаетесь с условиями обработки персональных данных.
            </p>
          </form>
        </div>
      </section>

      {/* ЖИВАЯ КАРТА МАСТЕРОВ (блок снизу тоже оставляю) */}
      <section id="live-map" className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-4">Мастера рядом</h2>
          <div className="rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
            <MapWithMasters height="420px" />
          </div>
        </div>
      </section>

      {/* Футер */}
      <footer id="contacts" className="border-t bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 grid md:grid-cols-3 gap-6 text-sm">
          <div>
            <div className="font-semibold">Контакты</div>
            <div className="mt-2 text-gray-600 dark:text-zinc-300">
              +7 (xxx) xxx-xx-xx<br />info@example.ru
            </div>
          </div>
          <div>
            <div className="font-semibold">Реквизиты</div>
            <div className="mt-2 text-gray-600 dark:text-zinc-300">
              ИП Чувашов Геннадий Валентинович<br />
              ИНН 402900754277 · ОГРНИП 325400000013867<br />
              Калужская обл., г. Калуга
            </div>
          </div>
          <div>
            <div className="font-semibold">Документы</div>
            <div className="mt-2 text-gray-600 dark:text-zinc-300">
              Публичная оферта · Политика · Согласие на ПДн
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
