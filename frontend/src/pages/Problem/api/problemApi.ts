import { Problem, ProblemCreateRequest } from '../types';

const getHeaders = () => {
  const token = localStorage.getItem('itsm_token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

const getApiUrl = () => import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const problemApi = {
  getProblems: async (): Promise<Problem[]> => {
    const response = await fetch(`${getApiUrl()}/api/problems`, {
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch problems');
    return response.json();
  },

  createProblem: async (data: ProblemCreateRequest): Promise<Problem> => {
    const response = await fetch(`${getApiUrl()}/api/problems`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create problem');
    return response.json();
  },

  updateProblem: async (id: number, data: Partial<ProblemCreateRequest>): Promise<Problem> => {
    const response = await fetch(`${getApiUrl()}/api/problems/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update problem');
    return response.json();
  },

  linkIncident: async (problemId: number, incidentId: number): Promise<void> => {
    const response = await fetch(`${getApiUrl()}/api/problems/${problemId}/link/${incidentId}`, {
      method: 'POST',
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to link incident');
  }
};
