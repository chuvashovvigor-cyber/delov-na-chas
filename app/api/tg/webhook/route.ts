// app/api/tg/webhook/route.ts
export const dynamic = 'force-dynamic';

import { redis, GEO_KEY, META_KEY, MASTER_TTL_SEC } from '../../../../lib/redis';

const TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID!;
const API = `https://api.telegram.org/bot${TOKEN}`;

async function send(chatId: number | string, text: string, extra?: any) {
  await fetch(`${API}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML', ...extra }),
  });
}

async function saveMasterLocation(opts: { id: number | string; lat: number; lon: number; name?: string }) {
  const id = String(opts.id);

  // GEO-индекс
  await redis.geoadd(GEO_KEY, { longitude: opts.lon, latitude: opts.lat, member: id });

  // мета + TTL (исчезает, если мастер перестал слать координаты)
  await redis.set(
    META_KEY(id),
    JSON.stringify({ id, name: opts.name || 'Мастер', updatedAt: Date.now() }),
    { ex: MASTER_TTL_SEC }
  );
}

export async function POST(req: Request) {
  const update = await req.json();

  try {
    const text: string | undefined = update.message?.text;
    const chatId = update.message?.chat?.id;
    const whoName: string | undefined =
      update.message?.from?.first_name ?? update.callback_query?.from?.first_name;

    if (text === '/chatid') {
      await send(chatId, `chat_id этой беседы: <code>${chatId}</code>`);
      return Response.json({ ok: true });
    }

    // Разовая локация
    if (update.message?.location) {
      const { latitude, longitude, live_period } = update.message.location;

      await saveMasterLocation({ id: chatId, lat: latitude, lon: longitude, name: whoName });
      await send(
        ADMIN_CHAT_ID,
        `📍 Геопозиция от ${whoName ?? chatId}:\nlat: ${latitude}\nlon: ${longitude}${
          live_period ? `\n(live ${live_period}s)` : ''
        }`
      );
      await send(chatId, `Ок, позиция принята ✅`);
      return Response.json({ ok: true });
    }

    // Обновления Live Location приходят как edited_message.location
    if (update.edited_message?.location) {
      const { latitude, longitude } = update.edited_message.location;
      const liveChatId = update.edited_message.chat?.id;

      await saveMasterLocation({
        id: liveChatId,
        lat: latitude,
        lon: longitude,
        name: update.edited_message?.from?.first_name,
      });
      return Response.json({ ok: true });
    }

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
        ].join('\n')
      );
      return Response.json({ ok: true });
    }

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

    if (text === '/onshift') {
      await send(
        chatId,
        [
          '👇 Как включить «живую» геолокацию:',
          '1) Нажмите скрепку / «+»',
          '2) Выберите «Геопозиция»',
          '3) «Поделиться геопозицией в реальном времени» и укажите время (например, 8 ч)',
          '',
          'Пока Live Location активна — метка на карте будет обновляться автоматически.',
        ].join('\n')
      );
      return Response.json({ ok: true });
    }

    if (text === '/offshift') {
      if (chatId) {
        await redis.del(META_KEY(String(chatId)));
        await redis.zrem(GEO_KEY, String(chatId)); // убрать из GEO
      }
      await send(chatId, 'Смена завершена. Метка скрыта с карты ✅');
      await send(ADMIN_CHAT_ID, `🔴 ${whoName ?? chatId} завершил(а) смену`);
      return Response.json({ ok: true });
    }

    if (update.callback_query?.data?.startsWith('status:')) {
      const status = update.callback_query.data.split(':')[1];
      const who = update.callback_query.from?.first_name || 'мастер';

      await send(ADMIN_CHAT_ID, `🟢 ${who}: статус → <b>${status}</b>`);
      await fetch(`${API}/answerCallbackQuery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ callback_query_id: update.callback_query.id, text: 'Обновлено' }),
      });
      return Response.json({ ok: true });
    }

    if (text && chatId) {
      await send(ADMIN_CHAT_ID, `📩 Сообщение от ${chatId}:\n${text}`);
    }

    return Response.json({ ok: true });
  } catch {
    return new Response('error', { status: 200 });
  }
}

// для setWebhook
export async function GET()  { return new Response('ok', { status: 200 }); }
export async function HEAD() { return new Response(null, { status: 200 }); }
