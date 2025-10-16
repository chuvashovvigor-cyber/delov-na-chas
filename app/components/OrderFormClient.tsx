'use client';

import MediaPicker from './MediaPicker';

export default function OrderFormClient() {
  return (
    <form method="post" action="/api/order" encType="multipart/form-data" className="mx-auto mt-8 max-w-xl grid gap-3">
      <input name="name" required placeholder="Ваше имя" className="rounded-xl border px-3 py-2" />
      <input name="phone" required placeholder="Телефон" className="rounded-xl border px-3 py-2" />
      <input name="address" placeholder="Адрес (необязательно)" className="rounded-xl border px-3 py-2" />
      <textarea name="details" required placeholder="Опишите задачу" rows={4} className="rounded-xl border px-3 py-2" />

      <MediaPicker />

      <button className="rounded-2xl bg-gray-900 text-white py-3 hover:bg-black">Отправить заявку</button>

      <p className="text-xs text-gray-500">
        Отправляя заявку, вы соглашаетесь с условиями обработки персональных данных.
      </p>
    </form>
  );
}
