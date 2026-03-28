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

  useEffect(() => {
    fetchChanges();
  }, [fetchChanges]);

  return { changes, loading, error, refresh: fetchChanges, createChange };
}

export function useChangeDetail(id: number | null) {
  const [change, setChange] = useState<Change | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDetail = useCallback(async () => {
    if (id === null) return;
    setLoading(true);
    try {
      const data = await changeApi.getDetail(id);
      setChange(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  const updateChange = async (updates: Partial<Change>) => {
    if (!id) return null;
    try {
      const updated = await changeApi.updateChange(id, updates);
      setChange(updated);
      return updated;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  };

  const deleteChange = async () => {
    if (!id) return false;
    try {
      await changeApi.deleteChange(id);
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  return { change, loading, error, refresh: fetchDetail, updateChange, deleteChange };
}
