import React from 'react';
import { KnowledgeArticle } from '../types';

interface Props {
  article: KnowledgeArticle;
  onClick: (article: KnowledgeArticle) => void;
}

const KnowledgeArticleCard: React.FC<Props> = ({ article, onClick }) => {
  return (
    <div
      onClick={() => onClick(article)}
      className="flex cursor-pointer items-center justify-between rounded-lg border border-[#333] bg-[#1e1e1e] px-8 py-6 shadow-md transition-all hover:scale-[1.01] hover:border-[#339af0] hover:bg-[#252525]"
    >
      <div className="flex-1">
        <h3 className="mb-2 text-xl font-semibold text-white">{article.title}</h3>
        <div className="flex items-center gap-4 text-sm text-[#888]">
          <span className="font-bold text-[#339af0]">{article.category}</span>
          <span>•</span>
          <span>Created: {new Date(article.createdAt).toLocaleDateString()}</span>
          <span>•</span>
          <span>Author: {article.authorName}</span>
        </div>
      </div>
      <div className="flex items-center gap-2 font-bold text-[#339af0]">
        Read <span className="text-xl">&rarr;</span>
      </div>
    </div>
  );
};

export default KnowledgeArticleCard;
