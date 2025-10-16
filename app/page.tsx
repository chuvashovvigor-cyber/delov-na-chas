// app/page.tsx
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="sticky top-0 z-40 w-full backdrop-blur bg-white/80 border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-gray-900" />
            <span className="font-semibold">Делов-на-час</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#services" className="hover:text-gray-700">Услуги</a>
            <a href="#how" className="hover:text-gray-700">Как это работает</a>
            <a href="#subscription" className="hover:text-gray-700">Подписка</a>
            <a href="#cases" className="hover:text-gray-700">Кейсы</a>
            <a href="#contacts" className="hover:text-gray-700">Контакты</a>
          </nav>
          <div className="flex items-center gap-2">
            <button className="hidden sm:inline-flex px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200">Войти</button>
            <a href="#order" className="px-4 py-2 rounded-xl bg-gray-900 text-white hover:bg-black">Вызвать мастера</a>
          </div>
        </div>
      </header>

      <section className="bg-gradient-to-b from-white to-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 lg:py-16 grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
              Делов-на-час — мастер на час и отделочные работы в Калуге
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Фикс-цены, быстрые заявки, подписки для физ и юр лиц. Живой трекинг мастера — как в такси.
            </p>

            {/* зелёные точки с пульсом — Tailwind only */}
            <div className="mt-6 flex items-center gap-6 text-sm text-gray-600">
              {[
                'Фикс-цена до выезда',
                'Приоритет по подписке',
                'Оплата на месте/онлайн',
              ].map((label) => (
                <div key={label} className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.9)]"></span>
                  </span>
                  {label}
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#order" className="px-5 py-3 rounded-2xl bg-gray-900 text-white hover:bg-black">Рассчитать и вызвать</a>
              <a href="#subscription" className="px-5 py-3 rounded-2xl bg-gray-100 hover:bg-gray-200">Оформить подписку</a>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-3xl border bg-white p-4 shadow-sm">
              <div className="aspect-[16/10] w-full rounded-2xl bg-gray-100 grid place-items-center text-gray-500">
                Карта трекинга мастера (превью)
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                <div className="rounded-xl bg-gray-50 p-3 border">
                  <div className="text-xs text-gray-500">Статус</div>
                  <div className="font-semibold">В пути</div>
                </div>
                <div className="rounded-xl bg-gray-50 p-3 border">
                  <div className="text-xs text-gray-500">ETA</div>
                  <div className="font-semibold">18 мин</div>
                </div>
                <div className="rounded-xl bg-gray-50 p-3 border">
                  <div className="text-xs text-gray-500">Мастер</div>
                  <div className="font-semibold">Саша · ★4.9</div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-6 -left-6 hidden lg:block">
              <div className="rounded-2xl border bg-white p-4 shadow-sm w-72">
                <div className="text-sm font-semibold">Мини-калькулятор</div>
                <div className="mt-3 grid gap-2">
                  <select className="w-full rounded-xl border px-3 py-2 bg-white">
                    <option>Выберите категорию</option>
                    <option>Электрика</option>
                    <option>Сантехника</option>
                    <option>Сборка</option>
                    <option>Отделка</option>
                    <option>Демонтаж</option>
                  </select>
                  <input className="w-full rounded-xl border px-3 py-2" placeholder="Что сделать?" />
                  <input className="w-full rounded-xl border px-3 py-2" placeholder="Кол-во / м²" />
                  <button className="w-full rounded-xl bg-gray-900 text-white py-2">Рассчитать</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 border-y bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-xs uppercase tracking-wider text-gray-500">Нам доверяют</div>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-6 opacity-70">
            <div className="h-10 rounded bg-gray-100 grid place-items-center">ВТБ</div>
            <div className="h-10 rounded bg-gray-100 grid place-items-center">El Coffee</div>
            <div className="h-10 rounded bg-gray-100 grid place-items-center">Bla-Bla bar</div>
            <div className="h-10 rounded bg-gray-100 grid place-items-center">ДК «Арбат»</div>
          </div>
        </div>
      </section>

      <section id="how" className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold">Как это работает</h2>
          <div className="mt-6 grid sm:grid-cols-3 gap-4">
            {[
              { t: 'Описываете задачу', d: 'Заполняете форму, прикрепляете фото/видео' },
              { t: 'Получаете цену', d: 'Менеджер подтверждает фикс-стоимость' },
              { t: 'Следите на карте', d: 'Мастер едет к вам, виден ETA и статус' },
            ].map((s, i) => (
              <div key={i} className="rounded-2xl border bg-white p-5">
                <div className="h-8 w-8 rounded-full bg-gray-900 text-white grid place-items-center font-semibold">
                  {i + 1}
                </div>
                <div className="mt-3 font-semibold">{s.t}</div>
                <div className="mt-1 text-gray-600 text-sm">{s.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="services" className="py-12 bg-white">
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
              <div key={i} className="rounded-2xl border p-5 hover:shadow-sm transition">
                <div className="font-semibold">{c.t}</div>
                <div className="mt-1 text-sm text-gray-600">{c.d}</div>
                <a href="#order" className="mt-4 inline-flex text-sm text-gray-900 underline underline-offset-4">
                  Рассчитать и заказать
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="subscription" className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold">Подписка для физ и юр лиц</h2>
          <div className="mt-6 grid md:grid-cols-3 gap-4">
            {[
              { t: 'Базовая', d: 'Приоритетный выезд, скидка на работы' },
              { t: 'Стандарт', d: 'Расширенный перечень, базовые расходники' },
              { t: 'Премиум', d: 'Максимум включений, SLA по времени' },
            ].map((p, i) => (
              <div key={i} className="rounded-2xl border bg-white p-5">
                <div className="font-semibold">{p.t}</div>
                <div className="mt-1 text-sm text-gray-600">{p.d}</div>
                <button className="mt-4 px-4 py-2 rounded-xl bg-gray-900 text-white">Оставить заявку</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="cases" className="py-12 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold">Кейсы и отзывы</h2>
          <div className="mt-6 grid md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl border overflow-hidden">
                <div className="h-40 bg-gray-100 grid place-items-center text-gray-500">Фото {i}</div>
                <div className="p-5">
                  <div className="font-semibold">Объект #{i}</div>
                  <div className="mt-1 text-sm text-gray-600">Коротко: что делали, за сколько, срок.</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="order" className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center">Готовы помочь сегодня</h2>
          <p className="mt-2 text-gray-600 text-center">
            Опишите задачу — заявка прилетит в наш Telegram-чат.
          </p>

          {/* ЕДИНСТВЕННАЯ форма (без вложенности) */}
          <form
            method="post"
            action="/api/order"
            encType="multipart/form-data"
            className="mx-auto mt-8 max-w-xl grid gap-3"
          >
            <input name="name" required placeholder="Ваше имя" className="rounded-xl border px-3 py-2" />
            <input name="phone" required placeholder="Телефон" className="rounded-xl border px-3 py-2" />
            <input name="address" placeholder="Адрес (необязательно)" className="rounded-xl border px-3 py-2" />
            <textarea name="details" required placeholder="Опишите задачу" rows={4} className="rounded-xl border px-3 py-2" />

            {/* Красивая кнопка для медиа */}
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
                <div className="text-sm font-medium">Прикрепить фото/видео</div>
                <div className="text-xs text-gray-500">Можно несколько файлов • до ~20 МБ каждый</div>
              </label>
            </div>

            <button className="rounded-2xl bg-gray-900 text-white py-3 hover:bg-black">Отправить заявку</button>

            <p className="text-xs text-gray-500">
              Отправляя заявку, вы соглашаетесь с условиями обработки персональных данных.
            </p>
          </form>

          <div className="mt-4 text-center text-sm text-gray-500">
            Или свяжитесь напрямую:
            <div className="mt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <a href="https://t.me/delov_na_chas_bot" className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200">Написать в Telegram</a>
              <a href="tel:+7XXXXXXXXXX" className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200">Позвонить</a>
            </div>
          </div>
        </div>
      </section>

      <footer id="contacts" className="border-t bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 grid md:grid-cols-3 gap-6 text-sm">
          <div>
            <div className="font-semibold">Контакты</div>
            <div className="mt-2 text-gray-600">+7 (xxx) xxx-xx-xx<br/>info@example.ru</div>
          </div>
          <div>
            <div className="font-semibold">Реквизиты</div>
            <div className="mt-2 text-gray-600">
              ИП Чувашов Геннадий Валентинович<br/>
              ИНН 402900754277 · ОГРНИП 325400000013867<br/>
              Калужская обл., г. Калуга
            </div>
          </div>
          <div>
            <div className="font-semibold">Документы</div>
            <div className="mt-2 text-gray-600">Публичная оферта · Политика · Согласие на ПДн</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
