import React, { useState } from 'react';
import SlaList from './components/SlaList';
import SlaDetailView from './components/SlaDetailView';

interface SlaPageProps {
  user: any;
}

const SLAPage: React.FC<SlaPageProps> = ({ user }) => {
  // user is currently not used but kept for prop consistency
  console.log('SLA Page loaded for user:', user?.username);
  const [viewState, setViewState] = useState<'LIST' | 'DETAIL'>('LIST');
  const [selectedSlaId, setSelectedSlaId] = useState<number | null>(null);

  const handleSelectSla = (id: number) => {
    setSelectedSlaId(id);
    setViewState('DETAIL');
  };

  const handleBackToList = () => {
    setViewState('LIST');
    setSelectedSlaId(null);
  };

  const handleDeleted = () => {
    handleBackToList();
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      {viewState === 'LIST' ? (
        <SlaList onSelectDetail={handleSelectSla} />
      ) : (
        selectedSlaId && (
          <SlaDetailView 
            slaId={selectedSlaId} 
            onBack={handleBackToList} 
            onDeleted={handleDeleted} 
          />
        )
      )}
    </div>
  );
};

export default SLAPage;
