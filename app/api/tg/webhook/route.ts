// app/api/tg/webhook/route.ts
export const dynamic = 'force-dynamic';

import { redis, GEO_KEY, META_KEY, MASTER_TTL_SEC } from '@/lib/redis';

const TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID!; // например: -1003112208284
const API = `https://api.telegram.org/bot${TOKEN}`;

async function send(chatId: number | string, text: string, extra?: any) {
  await fetch(`${API}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML', ...extra }),
  });
}

// единая функция сохранения локации мастера
async function saveMasterLocation(opts: {
  id: number | string;
  lat: number;
  lon: number;
  name?: string;
}) {
  const id = String(opts.id);

  // 1) в геоиндекс
  await redis.geoadd(GEO_KEY, {
    longitude: opts.lon,
    latitude: opts.lat,
    member: id,
  });

  // 2) мета с TTL (кроме имени можно хранить статус и т.п.)
  await redis.set(
    META_KEY(id),
    JSON.stringify({
      id,
      name: opts.name || 'Мастер',
      updatedAt: Date.now(),
    }),
    { ex: MASTER_TTL_SEC },
  );
}

export async function POST(req: Request) {
  const update = await req.json();

  try {
    const text: string | undefined = update.message?.text;
    const chatId = update.message?.chat?.id;
    const whoName: string | undefined =
      update.message?.from?.first_name ?? update.callback_query?.from?.first_name;

    // ===== /chatid
    if (text === '/chatid') {
      await send(chatId, `chat_id этой беседы: <code>${chatId}</code>`);
      return Response.json({ ok: true });
    }

    // ===== локация (обычная)
    if (update.message?.location) {
      const { latitude, longitude, live_period } = update.message.location;

      await saveMasterLocation({
        id: chatId,
        lat: latitude,
        lon: longitude,
        name: whoName,
      });

      await send(
        ADMIN_CHAT_ID,
        `📍 Геопозиция от ${whoName ?? chatId}:\nlat: ${latitude}\nlon: ${longitude}${
          live_period ? `\n(live ${live_period}s)` : ''
        }`,
      );

      // мастеру короткий ответ
      await send(chatId, `Ок, позиция принята ✅`);
      return Response.json({ ok: true });
    }

    // ===== «живая» локация: Telegram присылает как edited_message.location
    if (update.edited_message?.location) {
      const { latitude, longitude } = update.edited_message.location;
      const liveChatId = update.edited_message.chat?.id;

      await saveMasterLocation({
        id: liveChatId,
        lat: latitude,
        lon: longitude,
        name: update.edited_message?.from?.first_name,
      });

      // админам можно не спамить, но оставлю «тихий» лог
      // await send(ADMIN_CHAT_ID, `♻️ Live location обновлена от ${liveChatId}`);

      return Response.json({ ok: true });
    }

    // ===== старт
    if (text === '/start') {
      await send(
        chatId,
        [
          `Привет! Я бот «Делов-на-час».`,
          ``,
          `Команды:`,
          `/status — выбрать статус`,
          `/location — разовая геопозиция`,
          `/onshift — начать смену (включить Live Location)`,
          `/offshift — завершить смену (убрать метку с карты)`,
          `/chatid — показать id чата`,
        ].join('\n'),
      );
      return Response.json({ ok: true });
    }

    // ===== статусы — inline keyboard
    if (text === '/status') {
      await fetch(`${API}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: 'Выберите статус:',
          reply_markup: {
            inline_keyboard: [
              [{ text: '🚗 В пути', callback_data: 'status:enroute' }],
              [{ text: '📍 На месте', callback_data: 'status:onsite' }],
              [{ text: '🔧 Выполняется', callback_data: 'status:in_progress' }],
              [{ text: '✅ Завершено', callback_data: 'status:done' }],
            ],
          },
        }),
      });
      return Response.json({ ok: true });
    }

    // ===== одноразовая геопозиция
    if (text === '/location') {
      await fetch(`${API}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: 'Нажмите кнопку ниже и отправьте геопозицию.',
          reply_markup: {
            keyboard: [[{ text: 'Отправить геопозицию', request_location: true }]],
            resize_keyboard: true,
            one_time_keyboard: true,
          },
        }),
      });
      return Response.json({ ok: true });
    }

    // ===== начать смену (подсказка на Live Location)
    if (text === '/onshift') {
      await send(
        chatId,
        [
          '👇 Чтобы включить «живую» геолокацию:',
          '1) Нажмите скрепку / «+»',
          '2) Выберите «Геопозиция»',
          '3) Нажмите «Поделиться геопозицией в реальном времени» и укажите время (например, 8 часов)',
          '',
          'Пока делитесь Live Location — ваша метка будет автоматически обновляться на карте.',
        ].join('\n'),
      );
      return Response.json({ ok: true });
    }

    // ===== завершить смену (удаляем мету/метку)
    if (text === '/offshift') {
      if (chatId) {
        await redis.del(META_KEY(String(chatId)));
        // Геоиндекс сам «почистится» на чтении — но можно явно удалить:
        // в Redis для GEO нет "remove by member" отдельного, используем ZREM (гео хранится как zset)
        await redis.zrem(GEO_KEY, String(chatId));
      }
      await send(chatId, 'Смена завершена. Метка скрыта с карты ✅');
      await send(ADMIN_CHAT_ID, `🔴 ${whoName ?? chatId} завершил(а) смену`);
      return Response.json({ ok: true });
    }

    // ===== клик по статусам
    if (update.callback_query?.data?.startsWith('status:')) {
      const status = update.callback_query.data.split(':')[1];
      const who = update.callback_query.from?.first_name || 'мастер';

      await send(ADMIN_CHAT_ID, `🟢 ${who}: статус → <b>${status}</b>`);
      await fetch(`${API}/answerCallbackQuery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          callback_query_id: update.callback_query.id,
          text: 'Обновлено',
        }),
      });
      return Response.json({ ok: true });
    }

    // ===== любые тексты — пересылаем админу
    if (text && chatId) {
      await send(ADMIN_CHAT_ID, `📩 Сообщение от ${chatId}:\n${text}`);
    }

    return Response.json({ ok: true });
  } catch {
    // Telegram всегда ждёт 200 — даже если что-то пошло не так
    return new Response('error', { status: 200 });
  }
}

// Нужны для setWebhook
export async function GET()  { return new Response('ok', { status: 200 }); }
export async function HEAD() { return new Response(null, { status: 200 }); }
