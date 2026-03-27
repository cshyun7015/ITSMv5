import { useState, useEffect, useCallback } from 'react';
import { changeApi } from '../api/changeApi';
import type { Change, ChangeCreateRequest } from '../types';

export function useChanges() {
  const [changes, setChanges] = useState<Change[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChanges = useCallback(async () => {
    try {
      const data = await changeApi.getChanges();
      setChanges(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createChange = async (data: ChangeCreateRequest) => {
    try {
      const created = await changeApi.createChange(data);
      await fetchChanges();
      return created;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      const updated = await changeApi.updateStatus(id, status);
      await fetchChanges();
      return updated;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchChanges();
  }, [fetchChanges]);

  return { changes, loading, error, refresh: fetchChanges, createChange, updateStatus };
}
