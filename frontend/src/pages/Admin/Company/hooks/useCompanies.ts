import { useState, useCallback, useEffect } from 'react';
import { companyApi } from '../api/companyApi';
import type { Company } from '../types';

export const useCompanies = (search: string, page: number, sort: { field: string, dir: string }) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const fetchCompanies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await companyApi.getCompanies(page, 10, search, `${sort.field},${sort.dir}`);
      setCompanies(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, [page, search, sort]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCompanies();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchCompanies]);

  return { companies, loading, totalPages, totalElements, error, refetch: fetchCompanies };
};
