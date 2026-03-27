import type { Incident, IncidentCreateRequest } from '../types';

const getHeaders = () => {
  const token = localStorage.getItem('itsm_token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

const getApiUrl = () => import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const incidentApi = {
  getIncidents: async (): Promise<Incident[]> => {
    const response = await fetch(`${getApiUrl()}/api/incidents`, {
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch incidents');
    return response.json();
  },

  createIncident: async (data: IncidentCreateRequest): Promise<Incident> => {
    const response = await fetch(`${getApiUrl()}/api/incidents`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create incident');
    return response.json();
  },

  getAttachments: async (id: number): Promise<any[]> => {
    const response = await fetch(`${getApiUrl()}/api/attachments/list?relatedEntityType=INCIDENT&relatedEntityId=${id}`, {
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch attachments');
    return response.json();
  },

  getImpactedServices: async (assetId: number): Promise<any[]> => {
    const response = await fetch(`${getApiUrl()}/api/services/bia/${assetId}`, {
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch BIA');
    return response.json();
  },

  uploadAttachment: async (id: number, file: File): Promise<void> => {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('relatedEntityType', 'INCIDENT');
    fd.append('relatedEntityId', String(id));
    
    const response = await fetch(`${getApiUrl()}/api/attachments/upload`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('itsm_token')}` },
      body: fd
    });
    if (!response.ok) throw new Error('Failed to upload attachment');
  }
};
