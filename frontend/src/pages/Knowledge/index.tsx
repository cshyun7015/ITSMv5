import React, { useState } from 'react';
import { useKnowledge } from './hooks/useKnowledge';
import KnowledgeSearchBar from './components/KnowledgeSearchBar';
import KnowledgeArticleCard from './components/KnowledgeArticleCard';
import KnowledgeDetail from './components/KnowledgeDetail';
import { KnowledgeArticle } from './types';

const KnowledgePage: React.FC<{ user: any }> = ({ user }) => {
  const { articles, loading, error, fetchArticles } = useKnowledge(user.companyId);
  const [selectedArticle, setSelectedArticle] = useState<KnowledgeArticle | null>(null);

  const handleSearch = (keyword: string) => {
    setSelectedArticle(null);
    fetchArticles(keyword);
  };

  if (selectedArticle) {
    return (
      <div className="h-full overflow-y-auto bg-[#121212] p-8">
        <div className="mx-auto max-w-7xl">
          <KnowledgeDetail 
            article={selectedArticle} 
            onBack={() => setSelectedArticle(null)} 
          />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-[#121212] p-8">
      <div className="mx-auto max-w-7xl space-y-12">
        <header className="space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Knowledge Base
          </h1>
          <p className="text-xl text-[#888]">
            Find solutions, tech documents, and best practices shared by the IT team.
          </p>
        </header>

        <section className="space-y-8">
          <KnowledgeSearchBar onSearch={handleSearch} />

          {loading ? (
            <div className="flex justify-center py-20 text-xl font-medium text-white">
              Searching Knowledge Base...
            </div>
          ) : error ? (
            <div className="flex justify-center py-20 text-xl font-medium text-red-500">
              Error loading articles: {error}
            </div>
          ) : (
            <div className="space-y-4">
              {articles.length === 0 ? (
                <div className="rounded-lg border border-dashed border-[#555] bg-[#1e1e1e] py-20 text-center text-xl text-[#888]">
                  No articles found matching that keyword.
                </div>
              ) : (
                articles.map(article => (
                  <KnowledgeArticleCard
                    key={article.id}
                    article={article}
                    onClick={setSelectedArticle}
                  />
                ))
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default KnowledgePage;
