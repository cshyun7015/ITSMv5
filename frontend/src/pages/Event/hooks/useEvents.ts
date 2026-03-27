import { useState, useEffect, useCallback } from 'react';
import { eventApi } from '../api/eventApi';
import type { Event } from '../types';

export function useEvents(autoRefresh = true, interval = 10000) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    try {
      const data = await eventApi.getEvents();
      setEvents(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
    if (autoRefresh) {
      const timer = setInterval(fetchEvents, interval);
      return () => clearInterval(timer);
    }
  }, [fetchEvents, autoRefresh, interval]);

  return { events, loading, error, refresh: fetchEvents };
}
