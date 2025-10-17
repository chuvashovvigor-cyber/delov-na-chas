// app/order/page.tsx
import OrderClient from "./OrderClient";

// Статическая страница нам не нужна, пусть будет динамика (без кэша)
export const dynamic = "force-dynamic";

export default function Page() {
  // НИЧЕГО не передаём пропсами! Все интерактивные штуки внутри OrderClient.
  return <OrderClient />;
}
