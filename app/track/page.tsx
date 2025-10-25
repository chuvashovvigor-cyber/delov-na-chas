// app/track/page.tsx
'use client';

import dynamic from 'next/dynamic';

export const dynamic = 'force-dynamic' as const;
export const fetchCache = 'force-no-store' as const;

// ВАРИАНТ 1 (без алиасов) — работает всегда:
const MapWithMasters = dynamic(
  () => import('../../components/map/MapWithMasters'),
  { ssr: false }
);

// // ВАРИАНТ 2 (если у тебя настроен алиас "@/"):
// const MapWithMasters = dynamic(() => import('@/components/map/MapWithMasters'), { ssr: false });

export default function TrackPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold mb-4">Трекинг мастеров</h1>
      <MapWithMasters height="520px" />
    </div>
  );
}
