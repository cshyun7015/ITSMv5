import type { Release, ReleaseCreateRequest } from '../types';

const getHeaders = () => {
  const token = localStorage.getItem('itsm_token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

const getApiUrl = () => import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const releaseApi = {
  getReleases: async (): Promise<Release[]> => {
    const response = await fetch(`${getApiUrl()}/api/releases`, {
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch releases');
    return response.json();
  },

  createRelease: async (data: ReleaseCreateRequest): Promise<Release> => {
    const response = await fetch(`${getApiUrl()}/api/releases`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create release plan');
    return response.json();
  },

  updateStatus: async (id: number, status: string): Promise<Release> => {
    const response = await fetch(`${getApiUrl()}/api/releases/${id}/status`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ status })
    });
    if (!response.ok) throw new Error('Failed to update release status');
    return response.json();
  }
};
