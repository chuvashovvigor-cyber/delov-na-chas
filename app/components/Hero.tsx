// app/components/Hero.tsx
export default function Hero() {
  return (
    <section className="relative">
      {/* Контейнер 16:9 (поддерживается нативным CSS) */}
      <div className="relative w-full overflow-hidden rounded-3xl shadow-lg" style={{ aspectRatio: "16/9" }}>
        {/* Градиентный фон: синий → розовый */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f2d86] via-[#3b82f6] to-[#ff5bb6]" />

        {/* Лёгкая текстура/блик, чтобы фон «дышал» (необязательно) */}
        <div className="pointer-events-none absolute inset-0 opacity-30"
             style={{
               background:
                 "radial-gradient(1200px 600px at 20% 30%, rgba(255,255,255,0.25), transparent 60%), radial-gradient(800px 400px at 80% 70%, rgba(255,255,255,0.15), transparent 60%)"
             }}
        />

        {/* Контентная сетка */}
        <div className="absolute inset-0">
          <div className="mx-auto h-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid h-full grid-cols-12 items-center">
              {/* Текст слева */}
              <div className="col-span-12 md:col-span-7 lg:col-span-6 text-white">
                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold leading-tight drop-shadow-md">
                  делов-на-час — мастер на час и отделочные работы в Калуге
                </h1>
                <p className="mt-3 text-base sm:text-lg text-white/90 max-w-xl">
                  Фикс-цены, быстрые заявки, подписки для физ и юр лиц. Живой трекинг мастера — как в такси.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <a
                    href="/order"
                    className="inline-flex items-center justify-center rounded-2xl px-5 py-3 text-white shadow-lg
                               bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600
                               active:scale-[0.98] transition"
                  >
                    Вызвать мастера
                  </a>
                  <a
                    href="#services"
                    className="inline-flex items-center justify-center rounded-2xl px-5 py-3 bg-white/15 hover:bg-white/25
                               text-white shadow-md backdrop-blur-sm active:scale-[0.98] transition"
                  >
                    Услуги
                  </a>
                </div>
              </div>

              {/* Персонаж справа: ЧУТЬ МЕНЬШЕ и смещён правее */}
              <div className="col-span-12 md:col-span-5 lg:col-span-6 relative">
                <img
                  src="/hero/master-transparent.png"
                  alt="мастер на час"
                  className="pointer-events-none select-none absolute bottom-0 right-0
                             w-[36%] md:w-[40%] lg:w-[42%] max-w-none drop-shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
