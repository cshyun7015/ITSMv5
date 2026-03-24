import { useState, useEffect } from 'react';

export default function KnowledgeList({ user }: { user: any }) {
  const [articles, setArticles] = useState<any[]>([]);
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<any | null>(null);

  const fetchArticles = async (searchKw: string = '') => {
    setLoading(true);
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
    const token = localStorage.getItem('itsm_token');
    try {
      const response = await fetch(`${apiUrl}/api/knowledge?tenantId=${user.tenantId}&keyword=${encodeURIComponent(searchKw)}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setArticles(await response.json());
      }
    } catch (err) {
      console.error("Failed to load knowledge articles:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [user.tenantId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchArticles(keyword);
  };

  if (selectedArticle) {
    return (
      <div style={{ backgroundColor: '#1e1e1e', padding: '2.5rem', borderRadius: '12px', border: '1px solid #333', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
        <button onClick={() => setSelectedArticle(null)} style={{ backgroundColor: 'transparent', border: 'none', color: '#fcc419', cursor: 'pointer', marginBottom: '1.5rem', padding: 0, fontSize: '1rem' }}>
          &larr; Back to Search
        </button>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ backgroundColor: 'rgba(51, 154, 240, 0.2)', color: '#339af0', padding: '0.4rem 0.8rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold' }}>{selectedArticle.category}</span>
          <span style={{ color: '#888', fontSize: '0.85rem' }}>Views: {selectedArticle.viewCount}</span>
        </div>
        <h2 style={{ color: '#fff', margin: '1.5rem 0 2rem 0', fontSize: '2rem' }}>{selectedArticle.title}</h2>
        <div style={{ color: '#e0e0e0', lineHeight: '1.8', fontSize: '1.05rem', whiteSpace: 'pre-wrap', backgroundColor: '#2c2c2c', padding: '2rem', borderRadius: '8px', border: '1px solid #444' }}>
          {selectedArticle.content}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem' }}>
        <input 
          type="text" 
          placeholder="Search for solutions, keywords, or error codes..." 
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          style={{ flex: 1, padding: '1.2rem 1.5rem', borderRadius: '8px', border: '1px solid #444', backgroundColor: '#1e1e1e', color: '#fff', fontSize: '1.1rem', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}
        />
        <button type="submit" style={{ padding: '0 2rem', borderRadius: '8px', border: 'none', backgroundColor: '#339af0', color: '#fff', fontWeight: 'bold', cursor: 'pointer', fontSize: '1.1rem', transition: 'background-color 0.2s' }}>
          Search
        </button>
      </form>

      {loading ? (
        <div style={{ color: '#fff' }}>Searching Knowledge Base...</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {articles.length === 0 ? (
            <div style={{ color: '#888', padding: '2rem', textAlign: 'center', backgroundColor: '#1e1e1e', borderRadius: '8px', border: '1px dashed #555' }}>No articles found matching that keyword.</div>
          ) : (
            articles.map(article => (
              <div key={article.id} onClick={() => setSelectedArticle(article)} style={{ backgroundColor: '#1e1e1e', padding: '1.5rem 2rem', borderRadius: '8px', border: '1px solid #333', cursor: 'pointer', transition: 'transform 0.2s, background-color 0.2s', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
                <div>
                  <h3 style={{ color: '#fff', margin: '0 0 0.5rem 0', fontSize: '1.3rem' }}>{article.title}</h3>
                  <div style={{ display: 'flex', gap: '1rem', color: '#888', fontSize: '0.85rem' }}>
                    <span style={{ color: '#339af0' }}>{article.category}</span>
                    <span>•</span>
                    <span>Created: {new Date(article.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div style={{ color: '#339af0', fontWeight: 'bold' }}>Read &rarr;</div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
