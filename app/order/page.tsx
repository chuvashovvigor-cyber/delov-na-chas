// app/order/page.tsx
import dynamic from "next/dynamic";

export const metadata = {
  title: "Вызвать мастера — Делов-на-час",
};

const OrderClient = dynamic(() => import("./OrderClient"), { ssr: false });

export default function Page() {
  return <OrderClient />;
}
