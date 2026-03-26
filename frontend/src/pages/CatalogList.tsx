import { useState, useEffect } from 'react';

export default function CatalogList({ user, onSelectCatalog }: { user: any, onSelectCatalog: (id: number) => void }) {
  const [catalogs, setCatalogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCatalogs = async () => {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      const token = localStorage.getItem('itsm_token');
      try {
        const response = await fetch(`${apiUrl}/api/catalogs?tenantId=${user.tenantId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          setCatalogs(await response.json());
        }
      } catch (err) {
        console.error("Failed to load catalogs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCatalogs();
  }, [user.tenantId]);

  if (loading) return <div style={{ color: '#fff' }}>Loading Service Catalogs...</div>;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
      {catalogs.map(cat => (
        <div key={cat.id} 
             onClick={() => onSelectCatalog(cat.id)}
             className="catalog-card"
             style={{ 
               backgroundColor: '#1e1e1e', 
               padding: '1.5rem', 
               borderRadius: '12px', 
               border: '1px solid #333', 
               cursor: 'pointer', 
               transition: 'all 0.2s ease', 
               boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
               position: 'relative',
               overflow: 'hidden'
             }}>
          <div style={{ position: 'absolute', top: '1rem', right: '1rem', fontSize: '2rem', opacity: 0.15, transform: 'rotate(15deg)' }}>
            {cat.icon || '📋'}
          </div>
          <div style={{ color: '#339af0', fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{cat.category}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem' }}>
            <span style={{ fontSize: '1.5rem' }}>{cat.icon || '📋'}</span>
            <h3 style={{ color: '#fff', margin: 0 }}>{cat.catalogName}</h3>
          </div>
          <p style={{ color: '#aaa', fontSize: '0.9rem', lineHeight: '1.5', margin: 0 }}>{cat.description}</p>
        </div>
      ))}
    </div>
  );
}
