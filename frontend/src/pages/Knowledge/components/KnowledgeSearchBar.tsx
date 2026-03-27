import React, { useState } from 'react';

interface Props {
  onSearch: (keyword: string) => void;
}

const KnowledgeSearchBar: React.FC<Props> = ({ onSearch }) => {
  const [keyword, setKeyword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(keyword);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-4">
      <input
        type="text"
        placeholder="Search for solutions, keywords, or error codes..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        className="flex-1 rounded-lg border border-[#444] bg-[#1e1e1e] px-6 py-4 text-lg text-white shadow-lg focus:border-[#339af0] focus:outline-none"
      />
      <button
        type="submit"
        className="rounded-lg bg-[#339af0] px-8 py-4 text-lg font-bold text-white transition-colors hover:bg-[#228be6]"
      >
        Search
      </button>
    </form>
  );
};

export default KnowledgeSearchBar;
