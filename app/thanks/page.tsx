// app/thanks/page.tsx
export const metadata = {
  title: "Заявка отправлена — Делов-на-час",
  robots: { index: false, follow: false },
};

export default function Thanks() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header-бар как на главной (упрощённая версия) */}
      <header className="sticky top-0 z-40 w-full backdrop-blur bg-white/80 border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-gray-900" />
            <span className="font-semibold">Делов-на-час</span>
          </div>
          <a href="/" className="text-sm hover:text-gray-700">На главную</a>
        </div>
      </header>

      <main className="bg-gradient-to-b from-white to-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-20 grid lg:grid-cols-2 gap-10 items-center">
          <div className="order-2 lg:order-1">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500"></span>
              </span>
            </div>

            <h1 className="mt-4 text-3xl sm:text-4xl font-bold leading-tight">
              Заявка отправлена
            </h1>
            <p className="mt-3 text-lg text-gray-600">
              Мы получили вашу заявку в Telegram и скоро свяжемся.
              Обычно отвечаем в течение рабочего часа.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="/"
                className="px-5 py-3 rounded-2xl bg-gray-900 text-white hover:bg-black"
              >
                Вернуться на главную
              </a>
              <a
                href="https://t.me/delov_na_chas_bot"
                className="px-5 py-3 rounded-2xl bg-gray-100 hover:bg-gray-200"
              >
                Написать в Telegram
              </a>
            </div>

            <div className="mt-6 grid gap-3 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                </span>
                Приоритет по подписке
              </div>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                </span>
                Фикс-цена до выезда
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="rounded-3xl border bg-white p-4 shadow-sm">
              <div className="aspect-[16/10] w-full rounded-2xl bg-gray-100 grid place-items-center text-gray-500">
                Карта трекинга мастера (превью)
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                <div className="rounded-xl bg-gray-50 p-3 border">
                  <div className="text-xs text-gray-500">Статус</div>
                  <div className="font-semibold">Обрабатываем</div>
                </div>
                <div className="rounded-xl bg-gray-50 p-3 border">
                  <div className="text-xs text-gray-500">Оценка времени</div>
                  <div className="font-semibold">~15 мин</div>
                </div>
                <div className="rounded-xl bg-gray-50 p-3 border">
                  <div className="text-xs text-gray-500">Мастер</div>
                  <div className="font-semibold">Скоро назначим</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 text-sm text-gray-600">
          Спасибо, что выбрали нас 💛
        </div>
      </footer>
    </div>
  );
}
