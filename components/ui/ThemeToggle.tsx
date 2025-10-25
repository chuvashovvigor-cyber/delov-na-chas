"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setMounted(true);
    const ls = localStorage.getItem("theme");
    if (ls === "dark" || (!ls && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      document.documentElement.classList.add("dark");
      setDark(true);
    }
  }, []);

  if (!mounted) return null;

  const toggle = () => {
    const next = !dark;
    setDark(next);
    const root = document.documentElement;
    root.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <button
      onClick={toggle}
      className="inline-flex h-9 w-9 items-center justify-center rounded-xl border bg-white/70 text-gray-700 shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
      aria-label="Toggle theme"
      title="Тема"
    >
      {dark ? "🌙" : "☀️"}
    </button>
  );
}
