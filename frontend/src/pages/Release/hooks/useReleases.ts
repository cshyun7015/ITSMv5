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

  useEffect(() => {
    fetchReleases();
  }, [fetchReleases]);

  return { releases, loading, error, refresh: fetchReleases, createRelease };
}

export function useReleaseDetail(id: number | null) {
  const [release, setRelease] = useState<Release | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDetail = useCallback(async () => {
    if (id === null) return;
    setLoading(true);
    try {
      const data = await releaseApi.getDetail(id);
      setRelease(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  const updateRelease = async (updates: Partial<Release>) => {
    if (!id) return null;
    try {
      const updated = await releaseApi.updateRelease(id, updates);
      setRelease(updated);
      return updated;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  };

  const deleteRelease = async () => {
    if (!id) return false;
    try {
      await releaseApi.deleteRelease(id);
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  return { release, loading, error, refresh: fetchDetail, updateRelease, deleteRelease };
}
