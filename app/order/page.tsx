// app/order/page.tsx
import OrderClient from "./OrderClient";

// Страница динамическая (без SSG, чтобы не висеть на билде)
export const dynamic = "force-dynamic";

export default function Page() {
  // НИЧЕГО не передаём пропсами!
  return <OrderClient />;
}
