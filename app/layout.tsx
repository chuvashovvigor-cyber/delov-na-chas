// app/layout.tsx
import './globals.css';

export const metadata = {
  title: 'делов-на-час',
  description: 'Мастер на час и отделочные работы в Калуге',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // фиксируем тёмную тему классом `dark` на <html>
  return (
    <html lang="ru" className="dark">
      <body className="min-h-screen bg-zinc-950 text-zinc-100 antialiased">
        {children}
      </body>
    </html>
  );
}
