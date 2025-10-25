'use client';

import { useEffect, useState } from 'react';

type Props = {
  names?: string[];
  interval?: number; // ms
  className?: string;
};

export default function NameTicker({
  names = ['Саша', 'Игорь', 'Максим', 'Антон'],
  interval = 2500,
  className = '',
}: Props) {
  const [i, setI] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % names.length), interval);
    return () => clearInterval(id);
  }, [interval, names.length]);

  return (
    <span key={i} className={`inline-block transition-opacity duration-500 ${className}`}>
      {names[i]}
    </span>
  );
}
