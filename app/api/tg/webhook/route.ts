// app/api/tg/webhook/route.ts
export const dynamic = 'force-dynamic';

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
    const text: string | undefined = update.message?.text;
    const chatId = update.message?.chat?.id;

    if (text === '/chatid') {
      await send(chatId, `chat_id этой беседы: <code>${chatId}</code>`);
      return Response.json({ ok: true });
    }

    if (update.message?.location) {
      const { latitude, longitude } = update.message.location;
      await send(ADMIN_CHAT_ID, `📍 Геопозиция:\nlat: ${latitude}\nlon: ${longitude}`);
      return Response.json({ ok: true });
    }

    if (text === '/start') {
      await send(chatId, `Привет! Я бот «Делов-на-час».\n\nКоманды:\n/status — статусы заказа\n/location — отправить геопозицию\n/chatid — показать id чата`);
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

    if (update.callback_query?.data?.startsWith('status:')) {
      const status = update.callback_query.data.split(':')[1];
      const who = update.callback_query.from?.first_name || 'мастер';
      await send(ADMIN_CHAT_ID, `🟢 ${who}: статус изменён → <b>${status}</b>`);
      await fetch(`${API}/answerCallbackQuery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ callback_query_id: update.callback_query.id, text: 'Ок' }),
      });
      return Response.json({ ok: true });
    }

    if (text && chatId) {
      await send(ADMIN_CHAT_ID, `📩 Сообщение от ${chatId}:\n${text}`);
    }

    return Response.json({ ok: true });
  } catch (e) {
    console.error(e);
    return new Response('error', { status: 200 });
  }
}

// Нужны для setWebhook
export async function GET()  { return new Response('ok',  { status: 200 }); }
export async function HEAD() { return new Response(null,  { status: 200 }); }
