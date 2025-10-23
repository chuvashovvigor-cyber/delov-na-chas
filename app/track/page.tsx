'use client';

export const dynamic = 'force-dynamic' as const;
export const fetchCache = 'force-no-store' as const;

import NextDynamic from 'next/dynamic';
const TrackMap = NextDynamic(() => import('./TrackMap'), { ssr: false });

export default function TrackPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold mb-4">Трекинг мастеров</h1>
      <TrackMap />
    </div>
  );
}
// app/page.tsx (server)
import dynamic from "next/dynamic";

export const revalidate = 0;

const MapWithMasters = dynamic(() => import("@/components/map/MapWithMasters"), {
  ssr: false,
});

export default function Page() {
  return (
    <div className="min-h-screen">
      {/* ...твой контент... */}

      <section id="live-map" className="py-12">
        <h2 className="text-2xl font-bold mb-4">Мастера рядом</h2>
        <MapWithMasters height="420px" />
      </section>

      {/* ...твой контент... */}
    </div>
  );
}
