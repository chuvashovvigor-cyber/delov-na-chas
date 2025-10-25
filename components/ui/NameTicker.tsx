"use client";

import { useEffect, useState } from "react";

type Props = { names: string[]; intervalMs?: number };

export default function NameTicker({ names, intervalMs = 1800 }: Props) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (!names?.length) return;
    const t = setInterval(() => setI((p) => (p + 1) % names.length), intervalMs);
    return () => clearInterval(t);
  }, [names, intervalMs]);

  if (!names?.length) return null;

  return (
    <span className="inline-block animate-fade-in">
      {names[i]}
      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: .2; transform: translateY(4px) }
          to   { opacity: 1;  transform: translateY(0) }
        }
        .animate-fade-in { animation: fade-in .35s ease }
      `}</style>
    </span>
  );
}
