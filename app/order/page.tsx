// app/order/page.tsx
import OrderClient from './OrderClient';

export const metadata = {
  title: 'Вызвать мастера — Делов-на-час',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function Page() {
  return <OrderClient />; // НИКАКИХ пропсов
}
