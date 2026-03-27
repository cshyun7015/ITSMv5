import type { KnowledgeArticle, KnowledgeRequest } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const getHeaders = () => {
  const token = localStorage.getItem('itsm_token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

export const knowledgeApi = {
  getArticles: async (keyword: string = ''): Promise<KnowledgeArticle[]> => {
    const response = await fetch(`${API_URL}/api/knowledge?keyword=${encodeURIComponent(keyword)}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    if (!response.ok) {
        throw new Error('Failed to fetch articles');
    }
    return response.json();
  },

  createArticle: async (request: KnowledgeRequest): Promise<KnowledgeArticle> => {
    const response = await fetch(`${API_URL}/api/knowledge`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(request),
    });
    if (!response.ok) {
        throw new Error('Failed to create article');
    }
    return response.json();
  },
};
