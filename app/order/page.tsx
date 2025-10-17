// app/order/page.tsx
import dynamic from "next/dynamic";

export const metadata = {
  title: "Вызвать мастера — Делов-на-час",
};

// ВАЖНО: импортируем НОВЫЙ компонент ./Client, а не OrderClient
const Client = dynamic(() => import("./Client"), { ssr: false });

export default function Page() {
  return <Client />;
}
