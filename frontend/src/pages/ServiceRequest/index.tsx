import React, { useState } from 'react';
import { ServiceRequestList } from './components/ServiceRequestList';
import { ServiceRequestDetailView } from './components/ServiceRequestDetailView';
import type { User } from './types';

interface ServiceRequestPageProps {
  user: User;
}

const ServiceRequestPage: React.FC<ServiceRequestPageProps> = ({ user }) => {
  const [view, setView] = useState<'LIST' | 'DETAIL'>('LIST');
  const [selectedRequestId, setSelectedRequestId] = useState<number | null>(null);

  const handleSelectDetail = (id: number) => {
    setSelectedRequestId(id);
    setView('DETAIL');
  };

  const handleBack = () => {
    setSelectedRequestId(null);
    setView('LIST');
  };

  return (
    <div style={{ width: '100%' }}>
      {view === 'LIST' ? (
        <ServiceRequestList onSelectDetail={handleSelectDetail} />
      ) : (
        selectedRequestId && (
          <ServiceRequestDetailView 
            requestId={selectedRequestId} 
            onBack={handleBack} 
            currentUser={user} 
          />
        )
      )}
    </div>
  );
};

export default ServiceRequestPage;
export * from './types';
export * from './api/serviceRequestApi';
export * from './hooks/useServiceRequests';
