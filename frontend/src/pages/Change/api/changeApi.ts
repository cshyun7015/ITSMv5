import { Change, ChangeCreateRequest } from '../types';

const getHeaders = () => {
  const token = localStorage.getItem('itsm_token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

const getApiUrl = () => import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const changeApi = {
  getChanges: async (): Promise<Change[]> => {
    const response = await fetch(`${getApiUrl()}/api/changes`, {
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch changes');
    return response.json();
  },

  createChange: async (data: ChangeCreateRequest): Promise<Change> => {
    const response = await fetch(`${getApiUrl()}/api/changes`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create change request');
    return response.json();
  },

  updateStatus: async (id: number, status: string): Promise<Change> => {
    const response = await fetch(`${getApiUrl()}/api/changes/${id}/status`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ status })
    });
    if (!response.ok) throw new Error('Failed to update change status');
    return response.json();
  }
};
