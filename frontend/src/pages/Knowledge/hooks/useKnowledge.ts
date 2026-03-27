import { useState, useEffect, useCallback } from 'react';
import type { KnowledgeArticle } from '../types';
import { knowledgeApi } from '../api/knowledgeApi';

export const useKnowledge = (companyId: string) => {
  const [articles, setArticles] = useState<KnowledgeArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArticles = useCallback(async (keyword: string = '') => {
    setLoading(true);
    setError(null);
    try {
      const data = await knowledgeApi.getArticles(keyword);
      setArticles(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [companyId, fetchArticles]);

  return { articles, loading, error, fetchArticles };
};
