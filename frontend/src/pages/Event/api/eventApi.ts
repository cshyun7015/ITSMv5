import type { Event } from '../types';

const getHeaders = () => {
  const token = localStorage.getItem('itsm_token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

const getApiUrl = () => import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const eventApi = {
  getEvents: async (): Promise<Event[]> => {
    const response = await fetch(`${getApiUrl()}/api/events`, {
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch events');
    return response.json();
  }
};
