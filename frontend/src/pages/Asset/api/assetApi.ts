import type { Asset, AssetCreateRequest } from '../types';

const getHeaders = () => {
  const token = localStorage.getItem('itsm_token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

const getApiUrl = () => import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const assetApi = {
  getAssets: async (): Promise<Asset[]> => {
    const response = await fetch(`${getApiUrl()}/api/assets`, {
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch assets');
    return response.json();
  },

  getAsset: async (id: number): Promise<Asset> => {
    const response = await fetch(`${getApiUrl()}/api/assets/${id}`, {
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch asset');
    return response.json();
  },

  createAsset: async (data: AssetCreateRequest): Promise<Asset> => {
    const response = await fetch(`${getApiUrl()}/api/assets`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create asset');
    return response.json();
  },

  updateAsset: async (id: number, data: Partial<Asset>): Promise<Asset> => {
    const response = await fetch(`${getApiUrl()}/api/assets/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update asset');
    return response.json();
  },

  deleteAsset: async (id: number): Promise<void> => {
    const response = await fetch(`${getApiUrl()}/api/assets/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to delete asset');
  }
};
