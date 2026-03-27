import type { CommonCode, CommonCodeRequest } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const getHeaders = () => {
  const token = localStorage.getItem('itsm_token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

export const codeApi = {
  getCodes: async (page: number = 0, size: number = 15, search: string = '', sort: string = 'groupCode,asc&sort=sortOrder,asc') => {
    const response = await fetch(`${API_URL}/api/codes?page=${page}&size=${size}&search=${encodeURIComponent(search)}&sort=${sort}`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch codes');
    return response.json();
  },

  getCodesByGroup: async (groupCode: string): Promise<CommonCode[]> => {
    const response = await fetch(`${API_URL}/api/codes/group/${groupCode}`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch group codes');
    return response.json();
  },

  saveCode: async (request: CommonCodeRequest): Promise<CommonCode> => {
    const response = await fetch(`${API_URL}/api/codes`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(request),
    });
    if (!response.ok) throw new Error('Failed to save code');
    return response.json();
  },

  deleteCode: async (codeId: string): Promise<void> => {
    const response = await fetch(`${API_URL}/api/codes/${codeId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete code');
  },
};
