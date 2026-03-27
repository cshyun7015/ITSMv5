import { useState, useEffect, useCallback } from 'react';
import { ciApi } from '../api/ciApi';
import type { CI, CICreateRequest } from '../types';

export function useCI() {
  const [cis, setCIs] = useState<CI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCIs = useCallback(async () => {
    try {
      const data = await ciApi.getCIs();
      setCIs(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createCI = async (data: CICreateRequest) => {
    try {
      const created = await ciApi.createCI(data);
      await fetchCIs();
      return created;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchCIs();
  }, [fetchCIs]);

  return { cis, loading, error, refresh: fetchCIs, createCI };
}
