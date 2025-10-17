// app/track/page.tsx
export const dynamic = 'force-dynamic';
export const revalidate = 0; // <- именно число 0 (или false), не объект

import TrackClient from './TrackClient';

export default function Page() {
  // серверный компонент-обёртка: никаких браузерных API здесь
  return <TrackClient />;
}
