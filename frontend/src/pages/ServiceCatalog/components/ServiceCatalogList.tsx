import React from 'react';
import { useServiceCatalogs } from '../hooks/useServiceCatalogs';

interface ServiceCatalogListProps {
  onSelectCatalog: (id: number) => void;
}

export const ServiceCatalogList: React.FC<ServiceCatalogListProps> = ({ onSelectCatalog }) => {
  const { catalogs, loading, error } = useServiceCatalogs();

  if (loading) return <div style={{ color: '#fff', padding: '2rem' }}>신규 요청 카탈로그를 불러오는 중...</div>;
  if (error) return <div style={{ color: '#ff6b6b', padding: '2rem' }}>에러 발생: {error}</div>;

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
      gap: '2rem',
      padding: '0.5rem'
    }}>
      {catalogs.map(cat => (
        <div key={cat.id} 
             onClick={() => onSelectCatalog(cat.id)}
             style={{ 
               backgroundColor: '#1e1e1e', 
               padding: '2rem', 
               borderRadius: '16px', 
               border: '1px solid #333', 
               cursor: 'pointer', 
               transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
               boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
               position: 'relative',
               overflow: 'hidden',
               display: 'flex',
               flexDirection: 'column',
               justifyContent: 'space-between',
               height: '240px'
             }}
             onMouseEnter={(e) => {
               e.currentTarget.style.transform = 'translateY(-8px)';
               e.currentTarget.style.borderColor = '#339af0';
               e.currentTarget.style.boxShadow = '0 12px 40px rgba(51, 154, 240, 0.2)';
             }}
             onMouseLeave={(e) => {
               e.currentTarget.style.transform = 'translateY(0)';
               e.currentTarget.style.borderColor = '#333';
               e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.4)';
             }}>
          <div style={{ position: 'absolute', top: '-1rem', right: '-1rem', fontSize: '6rem', opacity: 0.05, transform: 'rotate(15deg)' }}>
            {cat.icon || '📋'}
          </div>
          
          <div>
            <div style={{ 
              color: '#339af0', 
              fontSize: '0.8rem', 
              marginBottom: '0.75rem', 
              fontWeight: 'bold', 
              textTransform: 'uppercase', 
              letterSpacing: '1px',
              backgroundColor: 'rgba(51, 154, 240, 0.1)',
              padding: '4px 10px',
              borderRadius: '20px',
              display: 'inline-block'
            }}>
              {cat.category}
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ 
                fontSize: '2rem', 
                width: '50px', 
                height: '50px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                backgroundColor: '#252525',
                borderRadius: '12px',
                border: '1px solid #444'
              }}>
                {cat.icon || '📋'}
              </div>
              <h3 style={{ color: '#fff', margin: 0, fontSize: '1.4rem', fontWeight: 600 }}>{cat.catalogName}</h3>
            </div>
            
            <p style={{ 
              color: '#aaa', 
              fontSize: '0.95rem', 
              lineHeight: '1.6', 
              margin: 0,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}>
              {cat.description}
            </p>
          </div>

          <div style={{ 
            marginTop: 'auto', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            color: '#339af0', 
            fontSize: '0.9rem', 
            fontWeight: 500 
          }}>
            신청하기 <span>&rarr;</span>
          </div>
        </div>
      ))}
    </div>
  );
};
