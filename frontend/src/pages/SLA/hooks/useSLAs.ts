import { useState, useEffect, useCallback } from 'react';
import { slaApi } from '../api/slaApi';
import type { SLA, SLACreateRequest } from '../types';

export function useSLAs() {
  const [slas, setSLAs] = useState<SLA[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSLAs = useCallback(async () => {
    try {
      const data = await slaApi.getSLAs();
      setSLAs(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createSLA = async (data: SLACreateRequest) => {
    try {
      const created = await slaApi.createSLA(data);
      await fetchSLAs();
      return created;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchSLAs();
  }, [fetchSLAs]);

  return { slas, loading, error, refresh: fetchSLAs, createSLA };
}
