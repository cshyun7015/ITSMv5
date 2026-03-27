import { useState, useCallback, useEffect } from 'react';
import { tenantApi } from '../api/tenantApi';
import type { Tenant } from '../types';

export const useTenants = (search: string, page: number, sort: { field: string, dir: string }) => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const fetchTenants = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await tenantApi.getTenants(page, 10, search, `${sort.field},${sort.dir}`);
      setTenants(data.content);
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
      fetchTenants();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchTenants]);

  return { tenants, loading, totalPages, totalElements, error, refetch: fetchTenants };
};
