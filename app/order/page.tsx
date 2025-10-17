// app/order/page.tsx
import OrderClient from './OrderClient';

export const metadata = {
  title: 'Вызвать мастера — Делов-на-час',
};

export default function Page() {
  return <OrderClient />; // НИКАКИХ пропсов
}
