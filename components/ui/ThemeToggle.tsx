'use client';

import { useEffect, useState } from 'react';

/**
 * Кнопка переключения темы (day/night).
 * Работает через класс 'dark' на <html> и localStorage('theme')
 */
export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setMounted(true);
    const root = document.documentElement;
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = saved ? saved === 'dark' : prefersDark;

    root.classList.toggle('dark', isDark);
    setDark(isDark);
  }, []);

  if (!mounted) return null;

  const toggle = () => {
    const root = document.documentElement;
    const next = !dark;
    root.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
    setDark(next);
  };

  return (
    <button
      onClick={toggle}
      className="rounded-xl px-3 py-2 text-sm font-medium bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow hover:shadow-md active:scale-[.98] transition"
      aria-label="Переключить тему"
    >
      {dark ? 'Ночь' : 'День'}
    </button>
  );
}
