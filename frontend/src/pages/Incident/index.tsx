import React, { useState } from 'react';
import IncidentList from './components/IncidentList';
import { IncidentDetailView } from './components/IncidentDetailView';

type ViewMode = 'LIST' | 'DETAIL';

const IncidentPage: React.FC<{ user: any }> = ({ user }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('LIST');
  const [selectedIncidentId, setSelectedIncidentId] = useState<number | null>(null);

  const handleSelectIncident = (id: number) => {
    setSelectedIncidentId(id);
    setViewMode('DETAIL');
  };

  const handleBack = () => {
    setSelectedIncidentId(null);
    setViewMode('LIST');
  };

  return (
    <div className="h-full overflow-y-auto bg-[#121212]">
      <div className="mx-auto max-w-7xl">
        {viewMode === 'LIST' ? (
          <IncidentList user={user} onSelectDetail={handleSelectIncident} />
        ) : (
          <div className="p-6">
            {selectedIncidentId && (
              <IncidentDetailView 
                incidentId={selectedIncidentId} 
                onBack={handleBack} 
                onDeleted={handleBack}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default IncidentPage;
