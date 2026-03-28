import type { Sla } from '../types';

const getApiUrl = () => import.meta.env.VITE_API_URL || 'http://localhost:8080';

const getHeaders = () => {
    const token = localStorage.getItem('itsm_token');
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
};

export const slaApi = {
    getSlas: async (): Promise<Sla[]> => {
        const response = await fetch(`${getApiUrl()}/api/slas`, {
            headers: getHeaders()
        });
        if (!response.ok) throw new Error('Failed to fetch SLAs');
        return response.json();
    },

    getSla: async (id: number): Promise<Sla> => {
        const response = await fetch(`${getApiUrl()}/api/slas/${id}`, {
            headers: getHeaders()
        });
        if (!response.ok) throw new Error('Failed to fetch SLA');
        return response.json();
    },

    createSla: async (data: Partial<Sla>): Promise<Sla> => {
        const response = await fetch(`${getApiUrl()}/api/slas`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to create SLA');
        return response.json();
    },

    updateSla: async (id: number, data: Partial<Sla>): Promise<Sla> => {
        const response = await fetch(`${getApiUrl()}/api/slas/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to update SLA');
        return response.json();
    },

    deleteSla: async (id: number): Promise<void> => {
        const response = await fetch(`${getApiUrl()}/api/slas/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        if (!response.ok) throw new Error('Failed to delete SLA');
    }
};
