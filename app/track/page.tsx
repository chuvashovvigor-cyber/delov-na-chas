// app/track/page.tsx
'use client';

export const dynamic = 'force-dynamic' as const;
export const fetchCache = 'force-no-store' as const;

import NextDynamic from 'next/dynamic';
const TrackMap = NextDynamic(() => import('../../components/map/MapWithMasters'), { ssr: false });

export default function TrackPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold mb-4">Трекинг мастеров</h1>
      <div className="rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
        <TrackMap height="520px" />
      </div>
    </div>
  );
}
