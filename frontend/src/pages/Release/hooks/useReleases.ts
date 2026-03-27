import { useState, useEffect, useCallback } from 'react';
import { releaseApi } from '../api/releaseApi';
import type { Release, ReleaseCreateRequest } from '../types';

export function useReleases() {
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReleases = useCallback(async () => {
    try {
      const data = await releaseApi.getReleases();
      setReleases(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createRelease = async (data: ReleaseCreateRequest) => {
    try {
      const created = await releaseApi.createRelease(data);
      await fetchReleases();
      return created;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      const updated = await releaseApi.updateStatus(id, status);
      await fetchReleases();
      return updated;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchReleases();
  }, [fetchReleases]);

  return { releases, loading, error, refresh: fetchReleases, createRelease, updateStatus };
}
