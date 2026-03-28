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

  getDetail: async (id: number): Promise<Release> => {
    const response = await fetch(`${getApiUrl()}/api/releases/${id}`, {
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch release detail');
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

  updateRelease: async (id: number, data: Partial<Release>): Promise<Release> => {
    const response = await fetch(`${getApiUrl()}/api/releases/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update release info');
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
  },

  deleteRelease: async (id: number): Promise<void> => {
    const response = await fetch(`${getApiUrl()}/api/releases/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to delete release plan');
  }
};
