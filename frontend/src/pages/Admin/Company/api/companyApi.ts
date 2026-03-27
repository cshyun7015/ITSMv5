import type { Company, CompanyRequest } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const getHeaders = () => {
  const token = localStorage.getItem('itsm_token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

export const companyApi = {
  getCompanies: async (page: number = 0, size: number = 10, search: string = '', sort: string = 'createdAt,desc') => {
    const response = await fetch(`${API_URL}/api/admin/companies?page=${page}&size=${size}&search=${encodeURIComponent(search)}&sort=${sort}`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch companies');
    return response.json();
  },

  createCompany: async (request: CompanyRequest): Promise<Company> => {
    const response = await fetch(`${API_URL}/api/admin/companies`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(request),
    });
    if (!response.ok) throw new Error('Failed to create company');
    return response.json();
  },

  updateCompany: async (companyId: string, request: CompanyRequest): Promise<Company> => {
    const response = await fetch(`${API_URL}/api/admin/companies/${companyId}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(request),
    });
    if (!response.ok) throw new Error('Failed to update company');
    return response.json();
  },

  deleteCompany: async (companyId: string): Promise<void> => {
    const response = await fetch(`${API_URL}/api/admin/companies/${companyId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete company');
  },
};
