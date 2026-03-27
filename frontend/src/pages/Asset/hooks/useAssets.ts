import { useState, useEffect, useCallback } from 'react';
import { assetApi } from '../api/assetApi';
import type { Asset, AssetCreateRequest } from '../types';

export function useAssets() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAssets = useCallback(async () => {
    try {
      const data = await assetApi.getAssets();
      setAssets(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createAsset = async (data: AssetCreateRequest) => {
    try {
      const created = await assetApi.createAsset(data);
      await fetchAssets();
      return created;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const updateAsset = async (id: number, data: Partial<Asset>) => {
    try {
      const updated = await assetApi.updateAsset(id, data);
      await fetchAssets();
      return updated;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const deleteAsset = async (id: number) => {
    try {
      await assetApi.deleteAsset(id);
      await fetchAssets();
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  return { assets, loading, error, refresh: fetchAssets, createAsset, updateAsset, deleteAsset };
}
