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

export async function POST(req: Request) {
  const update = await req.json();

  try {
    const msg = update.message ?? update.edited_message; // live-location приходит как edited_message
    const text: string | undefined = msg?.text;
    const chatId = msg?.chat?.id;
    const user = msg?.from;

    // 1) GEO-обновления
    const loc = msg?.location;
    if (loc && chatId) {
      const lon = Number(loc.longitude);
      const lat = Number(loc.latitude);
      const id = String(chatId);

      // сохраняем точку в GEO
      await (redis as any).geoadd(GEO_KEY, { longitude: lon, latitude: lat, member: id });

      // мета + TTL (имя, updatedAt)
      const meta = {
        name: [user?.first_name, user?.last_name].filter(Boolean).join(' ') || `Мастер ${id}`,
        updatedAt: Date.now(),
      };
      await redis.set(META_KEY(id), JSON.stringify(meta), { ex: MASTER_TTL_SEC });

      // уведомим админа “втихую”
      if (ADMIN_CHAT_ID) {
        await send(ADMIN_CHAT_ID, `📍 <b>${meta.name}</b>\nlat: ${lat}\nlon: ${lon}`);
      }

      return Response.json({ ok: true });
    }

    // 2) Команды
    if (text === '/chatid' && chatId) {
      await send(chatId, `chat_id этой беседы: <code>${chatId}</code>`);
      return Response.json({ ok: true });
    }

    if (text === '/start' && chatId) {
      await send(
        chatId,
        [
          `Привет! Я бот «Делов-на-час».`,
          ``,
          `Команды:`,
          `/status — выставить статус`,
          `/location — отправить геопозицию`,
          `/chatid — показать id чата`,
          ``,
          `Для «живого» трекинга включи в Telegram «Поделиться геопозицией в реальном времени»:`,
          `Крепёж → Местоположение → Поделиться геопозицией в реальном времени.`,
        ].join('\n'),
      );
      return Response.json({ ok: true });
    }

    if (text === '/status' && chatId) {
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

    if (text === '/location' && chatId) {
      await fetch(`${API}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: 'Нажмите кнопку ниже, чтобы отправить геопозицию.',
          reply_markup: {
            keyboard: [[{ text: 'Отправить геопозицию', request_location: true }]],
            resize_keyboard: true,
            one_time_keyboard: true,
          },
        }),
      });
      return Response.json({ ok: true });
    }

    // inline-кнопки статусов
    if (update.callback_query?.data?.startsWith('status:')) {
      const status = update.callback_query.data.split(':')[1];
      const who = update.callback_query.from?.first_name || 'мастер';

      await send(ADMIN_CHAT_ID, `🟢 ${who}: статус → <b>${status}</b>`);
      await fetch(`${API}/answerCallbackQuery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ callback_query_id: update.callback_query.id, text: 'Ок' }),
      });
      return Response.json({ ok: true });
    }

    // просто пробрасываем текст админу
    if (text && chatId) {
      await send(ADMIN_CHAT_ID, `📩 Сообщение от ${chatId}:\n${text}`);
    }

    return Response.json({ ok: true });
  } catch {
    // Возвращаем 200, чтобы TG не ретраил
    return new Response('ok', { status: 200 });
  }
}

export async function GET()  { return new Response('ok', { status: 200 }); }
export async function HEAD() { return new Response(null, { status: 200 }); }
