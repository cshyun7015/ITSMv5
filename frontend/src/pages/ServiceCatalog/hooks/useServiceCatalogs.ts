import { useState, useEffect, useCallback } from 'react';
import { serviceCatalogApi } from '../api/serviceCatalogApi';
import type { ServiceCatalog } from '../types';

export function useServiceCatalogs() {
  const [catalogs, setCatalogs] = useState<ServiceCatalog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCatalogs = useCallback(async () => {
    setLoading(true);
    try {
      const data = await serviceCatalogApi.getServiceCatalogs();
      setCatalogs(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCatalogs();
  }, [fetchCatalogs]);

  return { catalogs, loading, error, refresh: fetchCatalogs };
}

export function useServiceCatalogDetail(id: number | null) {
  const [catalog, setCatalog] = useState<ServiceCatalog | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetch = async () => {
      setLoading(true);
      try {
        const data = await serviceCatalogApi.getServiceCatalog(id);
        setCatalog(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  return { catalog, loading };
}
