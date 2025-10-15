import type { Metadata } from 'next'
import '../styles/globals.css'

export const metadata: Metadata = {
  title: 'Делов-на-час',
  description:
    'Фикс-цены, быстрые заявки, подписки для физ и юр лиц. Живой трекинг мастера — как в такси.',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  )
}
