import React, { useState } from 'react';
import { ServiceCatalogList } from './components/ServiceCatalogList';
import { ServiceRequestForm } from './components/ServiceRequestForm';

interface ServiceCatalogPageProps {
  user: any;
}

const ServiceCatalogPage: React.FC<ServiceCatalogPageProps> = ({ user }) => {
  const [view, setView] = useState<'LIST' | 'FORM'>('LIST');
  const [selectedCatalogId, setSelectedCatalogId] = useState<number | null>(null);

  const handleSelectCatalog = (id: number) => {
    setSelectedCatalogId(id);
    setView('FORM');
  };

  const handleBack = () => {
    setView('LIST');
    setSelectedCatalogId(null);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ color: '#fff', fontSize: '2.5rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>서비스 카탈로그</h1>
        <p style={{ color: '#aaa', fontSize: '1.1rem', margin: 0 }}>업무에 필요한 각종 서비스를 간편하게 신청하십시오.</p>
      </div>

      {view === 'LIST' ? (
        <ServiceCatalogList onSelectCatalog={handleSelectCatalog} />
      ) : (
        selectedCatalogId && (
          <ServiceRequestForm 
            user={user} 
            catalogId={selectedCatalogId} 
            onBack={handleBack} 
          />
        )
      )}
    </div>
  );
};

export default ServiceCatalogPage;
