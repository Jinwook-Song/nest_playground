'use client';

import { useEvents } from './events/useEvents';

export default function Home() {
  useEvents(['snapshots.generated'], (eventType) => {
    console.log(`✅ [${eventType}] event received`);
  });

  return <div>Hello World</div>;
}
