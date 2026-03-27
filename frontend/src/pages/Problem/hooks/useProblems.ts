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

  const updateProblem = async (id: number, data: Partial<ProblemCreateRequest>) => {
    try {
      const updated = await problemApi.updateProblem(id, data);
      await fetchProblems();
      return updated;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchProblems();
  }, [fetchProblems]);

  return { problems, loading, error, refresh: fetchProblems, createProblem, updateProblem };
}
