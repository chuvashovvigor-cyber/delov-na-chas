// app/api/order/route.ts
export const dynamic = "force-dynamic";

const TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const CHAT  = process.env.TELEGRAM_ADMIN_CHAT_ID!; // -1003112208284
const API   = `https://api.telegram.org/bot${TOKEN}`;

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const name    = String(form.get("name") || "").trim();
    const phone   = String(form.get("phone") || "").trim();
    const address = String(form.get("address") || "").trim();
    const details = String(form.get("details") || "").trim();

    if (!name || !phone || !details) {
      return new Response("Заполните имя, телефон и задачу", { status: 400 });
    }

    const text =
      `🆕 Новая заявка «Делов-на-час»\n` +
      `👤 Имя: ${name}\n` +
      `📞 Телефон: ${phone}\n` +
      (address ? `📍 Адрес: ${address}\n` : "") +
      `📝 Задача: ${details}`;

    const r = await fetch(`${API}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: CHAT, text }),
    });

    const data = await r.json();
    if (!data.ok) {
      return new Response(`Telegram error: ${JSON.stringify(data)}`, { status: 502 });
    }

    return new Response(
      `<meta charset="utf-8"><div style="font:16px/1.5 system-ui;padding:24px">Заявка отправлена! Мы свяжемся с вами.</div>`,
      { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  } catch (e: any) {
    return new Response(`Server error: ${e?.message || e}`, { status: 500 });
  }
}

// Временный пинг для проверки маршрута (можно удалить после теста)
export async function GET() {
  return new Response("order alive", { status: 200 });
}
