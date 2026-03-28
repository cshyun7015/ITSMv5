import React, { useState } from 'react';
import { ServiceRequestList } from './components/ServiceRequestList';
import { ServiceRequestDetailView } from './components/ServiceRequestDetailView';
import { ServiceRequestManualForm } from './components/ServiceRequestManualForm';
import type { User } from './types';

console.debug('[SR_PAGE] ServiceRequestManualForm component loaded:', typeof ServiceRequestManualForm);

interface ServiceRequestPageProps {
  user: User;
}

const ServiceRequestPage: React.FC<ServiceRequestPageProps> = ({ user }) => {
  const [view, setView] = useState<'LIST' | 'DETAIL' | 'MANUAL_CREATE'>('LIST');
  const [selectedRequestId, setSelectedRequestId] = useState<number | null>(null);

  const handleSelectDetail = (id: number) => {
    setSelectedRequestId(id);
    setView('DETAIL');
  };

  const handleManualCreate = () => {
    console.debug('[SR_PAGE] handleManualCreate called');
    window.alert('Manual Create Button Clicked!');
    setView('MANUAL_CREATE');
  };

  const handleBack = () => {
    setSelectedRequestId(null);
    setView('LIST');
  };

  console.debug('[SR_PAGE] Rendering ServiceRequestPage. View:', view);

  return (
    <div style={{ width: '100%' }}>
      {view === 'LIST' ? (
        <ServiceRequestList onSelectDetail={handleSelectDetail} onManualCreate={handleManualCreate} />
      ) : view === 'DETAIL' ? (
        selectedRequestId && (
          <ServiceRequestDetailView 
            requestId={selectedRequestId} 
            onBack={handleBack} 
            currentUser={user} 
          />
        )
      ) : (
        <ServiceRequestManualForm onBack={handleBack} />
      )}
    </div>
  );
};

export default ServiceRequestPage;
export * from './types';
export * from './api/serviceRequestApi';
export * from './hooks/useServiceRequests';
