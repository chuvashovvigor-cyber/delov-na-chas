// app/order/page.tsx
import OrderClient from './OrderClient';

export const metadata = {
  title: 'Вызвать мастера — Делов-на-час',
};

// Отключаем статическую генерацию, чтобы страница не строилась на билде
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function Page() {
  return <OrderClient />;
}
