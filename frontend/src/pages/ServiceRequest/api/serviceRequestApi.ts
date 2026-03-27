import type { ServiceRequest, ServiceRequestListResponse, ServiceRequestFilters } from '../types';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('itsm_token')}`
});

export const serviceRequestApi = {
  getRequests: async (filters: ServiceRequestFilters): Promise<ServiceRequestListResponse> => {
    const { page, size, search, status, sort } = filters;
    const url = `${apiUrl}/api/requests/admin/list?page=${page}&size=${size}&search=${encodeURIComponent(search)}&status=${status}&sort=${sort}`;
    const res = await fetch(url, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch requests');
    return res.json();
  },

  getDetail: async (id: number): Promise<ServiceRequest> => {
    const res = await fetch(`${apiUrl}/api/requests/admin/${id}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch SR detail');
    return res.json();
  },

  updateRequest: async (id: number, updates: Partial<ServiceRequest> & { assigneeId?: number }): Promise<ServiceRequest> => {
    const res = await fetch(`${apiUrl}/api/requests/admin/${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error('Failed to update request');
    return res.json();
  },

  deleteRequest: async (id: number): Promise<void> => {
    const res = await fetch(`${apiUrl}/api/requests/admin/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete request');
  }
};
