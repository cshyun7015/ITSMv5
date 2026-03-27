import React from 'react';
import { KnowledgeArticle } from '../types';

interface Props {
  article: KnowledgeArticle;
  onBack: () => void;
}

const KnowledgeDetail: React.FC<Props> = ({ article, onBack }) => {
  return (
    <div className="rounded-xl border border-[#333] bg-[#1e1e1e] p-10 shadow-2xl">
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-2 border-none bg-transparent text-lg text-[#fcc419] transition-colors hover:text-[#fab005] focus:outline-none"
      >
        <span>&larr;</span> Back to Search
      </button>
      
      <div className="mb-8 flex items-center justify-between">
        <span className="rounded-full bg-[#1c7ed626] px-4 py-1.5 text-sm font-bold text-[#339af0]">
          {article.category}
        </span>
        <div className="flex gap-6 text-sm text-[#888]">
          <span>Author: <span className="text-white">{article.authorName}</span></span>
          <span>Views: <span className="text-white">{article.viewCount}</span></span>
          <span>Updated: <span className="text-white">{new Date(article.updatedAt).toLocaleDateString()}</span></span>
        </div>
      </div>
      
      <h2 className="mb-10 text-4xl font-extrabold text-white leading-tight">
        {article.title}
      </h2>
      
      <div className="rounded-lg border border-[#444] bg-[#2c2c2c] p-10 text-lg leading-relaxed text-[#e0e0e0] shadow-inner whitespace-pre-wrap">
        {article.content}
      </div>
    </div>
  );
};

export default KnowledgeDetail;
