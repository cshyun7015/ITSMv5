import { SLA, SLACreateRequest } from '../types';

const getHeaders = () => {
  const token = localStorage.getItem('itsm_token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

const getApiUrl = () => import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const slaApi = {
  getSLAs: async (): Promise<SLA[]> => {
    const response = await fetch(`${getApiUrl()}/api/slas`, {
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch SLA data');
    return response.json();
  },

  createSLA: async (data: SLACreateRequest): Promise<SLA> => {
    const response = await fetch(`${getApiUrl()}/api/slas`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create SLA record');
    return response.json();
  }
};
