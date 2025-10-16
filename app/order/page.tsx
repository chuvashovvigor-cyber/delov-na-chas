// app/order/page.tsx
import dynamic from 'next/dynamic';

export const metadata = {
  title: 'Вызвать мастера — Делов-на-час',
  description: 'Оформите заявку, прикрепите фото/видео и укажите адрес на карте.',
};

// подключаем карту/клиентскую часть без SSR,
// чтобы на сервере ничего не трогало window
const OrderClient = dynamic(() => import('./OrderClient'), {
  ssr: false,
  // optional: можно показать заглушку пока грузится карта
  loading: () => (
    <div className="mt-6 h-[360px] rounded-2xl border bg-gray-50 grid place-items-center text-gray-500">
      Загрузка карты…
    </div>
  ),
});

export default function OrderPage() {
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
            <p className="mt-3 text-gray-600">
              Опишите задачу — заявка прилетит в наш Telegram-чат.
            </p>

            {/* Вся «живность» (форма, загрузка медиа, карта, поиск адреса) — внутри OrderClient */}
            <OrderClient city="Калуга" onChange={() => { /* noop: реальное onChange уже внутри */ }} />
          </section>

          {/* Можно добавить любой серверный сайдбар/инфоблок — без доступа к window */}
          <aside className="rounded-3xl border bg-white p-4 shadow-sm">
            <div className="text-sm font-semibold mb-2">Как это работает</div>
            <ol className="list-decimal list-inside text-sm text-gray-700 space-y-1">
              <li>Заполните форму и прикрепите фото/видео.</li>
              <li>Выберите адрес на карте или через поиск.</li>
              <li>Мы подтвердим цену и пришлём ETA мастера.</li>
            </ol>
          </aside>
        </div>
      </main>
    </div>
  );
}
