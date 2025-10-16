// app/thanks/page.tsx
export const metadata = {
  title: "Заявка отправлена — Делов-на-час",
  robots: { index: false, follow: false },
};

export default function Thanks() {
  return (
    <main className="min-h-[60vh] grid place-items-center px-4">
      <div className="max-w-lg text-center space-y-4">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <span className="h-3 w-3 rounded-full bg-green-500 animate-ping"></span>
        </div>

        <h1 className="text-2xl font-bold">Заявка отправлена</h1>

        <p className="text-gray-600">
          Мы получили вашу заявку в Telegram и свяжемся в ближайшее время.
        </p>

        <a
          href="/"
          className="inline-block rounded-xl bg-gray-900 text-white px-4 py-2 hover:bg-black"
        >
          Вернуться на главную
        </a>

        <p className="text-xs text-gray-500">
          Если что-то пошло не так — напишите нам в&nbsp;
          <a
            href="https://t.me/delov_na_chas_bot"
            className="underline underline-offset-4"
          >
            Telegram
          </a>.
        </p>
      </div>
    </main>
  );
}
