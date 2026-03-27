import { useState, useCallback, useEffect } from 'react';
import { codeApi } from '../api/codeApi';
import type { CommonCode } from '../types';

export const useCodes = (search: string, page: number, sort: { field: string, dir: string }) => {
  const [codes, setCodes] = useState<CommonCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const fetchCodes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // For multi-sort (default), we handle it by groupCode,sortOrder if field is groupCode
      const sortParam = sort.field === 'groupCode' 
        ? `groupCode,${sort.dir}&sort=sortOrder,asc` 
        : `${sort.field},${sort.dir}`;

      const data = await codeApi.getCodes(page, 15, search, sortParam);
      setCodes(data.content || []);
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
      fetchCodes();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchCodes]);

  return { codes, loading, totalPages, totalElements, error, refetch: fetchCodes };
};
