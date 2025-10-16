// app/api/order/route.ts
export const runtime = "nodejs";   // нужен Node runtime для работы с FormData/Blob
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

const TOKEN   = process.env.TELEGRAM_BOT_TOKEN!;
const CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID!; // id чата/группы, куда слать заявки

function esc(s: string) {
  return s.replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c]!));
}

async function sendText(text: string) {
  const r = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
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
  return r;
}

async function sendMedia(file: File) {
  const type = file.type || "";
  const fd = new FormData();
  fd.append("chat_id", CHAT_ID);
  const filename = (file as any).name || "upload";

  if (type.startsWith("image/")) {
    fd.append("photo", file, filename);
    return fetch(`https://api.telegram.org/bot${TOKEN}/sendPhoto`, {
      method: "POST",
      body: fd,
      cache: "no-store",
    }).then(r => r.json());
  } else if (type.startsWith("video/")) {
    fd.append("video", file, filename);
    return fetch(`https://api.telegram.org/bot${TOKEN}/sendVideo`, {
      method: "POST",
      body: fd,
      cache: "no-store",
    }).then(r => r.json());
  } else {
    // на всякий — другие форматы улетают как документ
    fd.append("document", file, filename);
    return fetch(`https://api.telegram.org/bot${TOKEN}/sendDocument`, {
      method: "POST",
      body: fd,
      cache: "no-store",
    }).then(r => r.json());
  }
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

    // 1) Текст заявки
    const text =
      `<b>Новая заявка</b>\n` +
      `<b>Имя:</b> ${esc(name)}\n` +
      `<b>Телефон:</b> ${esc(phone)}\n` +
      (address ? `<b>Адрес:</b> ${esc(address)}\n` : "") +
      `<b>Задача:</b>\n${esc(details)}\n\n#lead`;

    const sent = await sendText(text);
    if (!sent.ok) {
      return NextResponse.json({ ok: false, error: sent }, { status: 502 });
    }

    // 2) Медиа (несколько файлов)
    const medias = form.getAll("media") as File[];
    for (const f of medias) {
      if (!f || typeof f.size !== "number") continue;
      // не перегружаем серверлесс — ~20 МБ/файл
      if (f.size > 20 * 1024 * 1024) {
        await sendText(`⚠️ Файл >20 МБ не отправлен: ${(f as any).name || "file"}`);
        continue;
      }
      await sendMedia(f);
    }

    return NextResponse.redirect(new URL("/thanks", req.url), 303);
  } catch (e) {
    return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true });
}
