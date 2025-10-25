'use client';

import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setMounted(true);
    // стартовое состояние из html
    setDark(document.documentElement.classList.contains('dark'));
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    if (dark) root.classList.add('dark');
    else root.classList.remove('dark');
  }, [dark, mounted]);

  if (!mounted) return null;

  return (
    <button
      onClick={() => setDark((v) => !v)}
      className="inline-flex items-center gap-2 rounded-xl px-3 py-2
                 bg-gradient-to-r from-blue-500 to-indigo-600 text-white
                 shadow hover:shadow-md active:scale-[0.98] transition"
      aria-label="Переключить тему"
      type="button"
    >
      {dark ? 'Темная' : 'Светлая'}
    </button>
  );
}
