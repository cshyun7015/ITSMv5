import { useState, useEffect, useCallback } from 'react';
import { problemApi } from '../api/problemApi';
import type { Problem, ProblemCreateRequest } from '../types';

export function useProblems() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProblems = useCallback(async () => {
    try {
      const data = await problemApi.getProblems();
      setProblems(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createProblem = async (data: ProblemCreateRequest) => {
    try {
      const created = await problemApi.createProblem(data);
      await fetchProblems();
      return created;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchProblems();
  }, [fetchProblems]);

  return { problems, loading, error, refresh: fetchProblems, createProblem };
}

export function useProblemDetail(id: number | null) {
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDetail = useCallback(async () => {
    if (id === null) return;
    setLoading(true);
    try {
      const data = await problemApi.getDetail(id);
      setProblem(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  const updateProblem = async (updates: Partial<Problem>) => {
    if (!id) return null;
    try {
      const updated = await problemApi.updateProblem(id, updates);
      setProblem(updated);
      return updated;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  };

  const deleteProblem = async () => {
    if (!id) return false;
    try {
      await problemApi.deleteProblem(id);
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  return { problem, loading, error, refresh: fetchDetail, updateProblem, deleteProblem };
}
