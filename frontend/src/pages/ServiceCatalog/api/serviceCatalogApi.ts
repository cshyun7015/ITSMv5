import type { ServiceCatalog } from '../types';

const getHeaders = () => {
  const token = localStorage.getItem('itsm_token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

const getApiUrl = () => import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const serviceCatalogApi = {
  getServiceCatalogs: async (): Promise<ServiceCatalog[]> => {
    const response = await fetch(`${getApiUrl()}/api/catalogs`, {
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch service catalogs');
    const data = await response.json();
    console.debug('[API] getServiceCatalogs success:', data.length, 'items');
    return data;
  },

  getServiceCatalog: async (id: number): Promise<ServiceCatalog> => {
    const response = await fetch(`${getApiUrl()}/api/catalogs/${id}`, {
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch service catalog');
    return response.json();
  },

  // Admin methods
  adminGetServiceCatalogs: async (search: string, page: number, size: number, companyId?: string): Promise<any> => {
    let url = `${getApiUrl()}/api/admin/catalogs?page=${page}&size=${size}&search=${encodeURIComponent(search)}`;
    if (companyId) url += `&companyId=${companyId}`;
    
    //console.log('[DEBUG] Fetching admin catalogs:', url);
    const headers = getHeaders();
    //console.log('[DEBUG] Headers:', headers);
    
    const response = await fetch(url, { headers });
    if (!response.ok) {
      console.error('[DEBUG] Admin catalogs fetch failed:', response.status, response.statusText);
      throw new Error('Failed to fetch admin service catalogs');
    }
    return response.json();
  },

  createServiceCatalog: async (data: any) => {
    const response = await fetch(`${getApiUrl()}/api/admin/catalogs`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create service catalog');
    return response.json();
  },

  updateServiceCatalog: async (id: number, data: any) => {
    const response = await fetch(`${getApiUrl()}/api/admin/catalogs/${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update service catalog');
    return response.json();
  },

  deleteServiceCatalog: async (id: number) => {
    const response = await fetch(`${getApiUrl()}/api/admin/catalogs/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to delete service catalog');
  }
};
