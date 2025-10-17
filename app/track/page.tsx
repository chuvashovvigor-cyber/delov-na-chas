// app/track/page.tsx
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import Client from './client';

export default function Page() {
  return <Client />;
}
