import { CI, CICreateRequest } from '../types';

const getHeaders = () => {
  const token = localStorage.getItem('itsm_token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

const getApiUrl = () => import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const ciApi = {
  getCIs: async (): Promise<CI[]> => {
    const response = await fetch(`${getApiUrl()}/api/ci`, {
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch configuration items');
    return response.json();
  },

  createCI: async (data: CICreateRequest): Promise<CI> => {
    const response = await fetch(`${getApiUrl()}/api/ci`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create CI');
    return response.json();
  }
};
