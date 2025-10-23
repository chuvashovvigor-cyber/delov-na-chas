// /lib/map/useMasters.ts
"use client";

import { useEffect, useState } from "react";

export type Master = {
  id: string;
  name?: string;
  lat: number;
  lon: number;
  status?: string;
  updatedAt?: number;
};

export function useMasters(refreshMs = 3000) {
  const [data, setData] = useState<Master[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let timer: any;

    const tick = async () => {
      try {
        const r = await fetch("/api/masters/all", { cache: "no-store" });
        const json = (await r.json()) as { masters: Master[] } | Master[];
        const arr = Array.isArray(json) ? json : json.masters ?? [];
        setData(arr);
      } catch (e) {
        console.error("masters fetch error", e);
      } finally {
        setLoading(false);
      }
      timer = setTimeout(tick, refreshMs);
    };

    tick();
    return () => clearTimeout(timer);
  }, [refreshMs]);

  return { masters: data, loading };
}
