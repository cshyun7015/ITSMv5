import type { Tenant, TenantRequest } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const getHeaders = () => {
  const token = localStorage.getItem('itsm_token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

export const tenantApi = {
  getTenants: async (page: number = 0, size: number = 10, search: string = '', sort: string = 'createdAt,desc') => {
    const response = await fetch(`${API_URL}/api/admin/tenants?page=${page}&size=${size}&search=${encodeURIComponent(search)}&sort=${sort}`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch tenants');
    return response.json();
  },

  createTenant: async (request: TenantRequest): Promise<Tenant> => {
    const response = await fetch(`${API_URL}/api/admin/tenants`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(request),
    });
    if (!response.ok) throw new Error('Failed to create tenant');
    return response.json();
  },

  updateTenant: async (tenantId: string, request: TenantRequest): Promise<Tenant> => {
    const response = await fetch(`${API_URL}/api/admin/tenants/${tenantId}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(request),
    });
    if (!response.ok) throw new Error('Failed to update tenant');
    return response.json();
  },

  deleteTenant: async (tenantId: string): Promise<void> => {
    const response = await fetch(`${API_URL}/api/admin/tenants/${tenantId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete tenant');
  },
};
