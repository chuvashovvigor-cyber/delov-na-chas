// app/api/order/route.ts
import { NextResponse } from "next/server";

const TOKEN   = process.env.TELEGRAM_BOT_TOKEN!;
const CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID!; // можно ID группы (часто начинается с -100…)

function esc(s: string) {
  return s.replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c]!));
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const name    = (form.get("name")    || "").toString().trim();
    const phone   = (form.get("phone")   || "").toString().trim();
    const address = (form.get("address") || "").toString().trim();
    const details = (form.get("details") || "").toString().trim();

    if (!name || !phone || !details) {
      return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 400 });
    }

    const text =
      `<b>Новая заявка</b>\n` +
      `<b>Имя:</b> ${esc(name)}\n` +
      `<b>Телефон:</b> ${esc(phone)}\n` +
      (address ? `<b>Адрес:</b> ${esc(address)}\n` : "") +
      `<b>Задача:</b>\n${esc(details)}\n\n#lead`;

    const tg = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
      cache: "no-store",
    }).then(r => r.json());

    if (!tg.ok) {
      return NextResponse.json({ ok: false, error: tg }, { status: 502 });
    }

    // после успешной отправки — на страницу "спасибо"
    return NextResponse.redirect(new URL("/thanks", req.url), 303);
  } catch (e) {
    return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 500 });
  }
}

// чтобы проверять GET (health-check)
export async function GET() {
  return NextResponse.json({ ok: true });
}
