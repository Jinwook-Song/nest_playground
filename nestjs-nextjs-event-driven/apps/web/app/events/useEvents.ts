'use client';

import { useEffect } from 'react';

export function useEvents(
  eventTypes: string[],
  callback: (eventType: string) => void,
) {
  useEffect(() => {
    const eventSource = new EventSource('/api/events/sse');

    eventSource.onmessage = (event) => {
      const parsedData = JSON.parse(event.data);
      if (eventTypes.includes(parsedData.eventType)) {
        callback(parsedData.eventType);
      }
    };

    return () => eventSource.close();
  }, [eventTypes, callback]);
}
