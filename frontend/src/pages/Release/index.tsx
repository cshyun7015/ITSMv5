import React, { useState } from 'react';
import ReleaseList from './components/ReleaseList';
import { ReleaseDetailView } from './components/ReleaseDetailView';

type ViewMode = 'LIST' | 'DETAIL';

const ReleasePage: React.FC<{ user: any }> = ({ user }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('LIST');
  const [selectedReleaseId, setSelectedReleaseId] = useState<number | null>(null);

  const handleSelectRelease = (id: number) => {
    setSelectedReleaseId(id);
    setViewMode('DETAIL');
  };

  const handleBack = () => {
    setSelectedReleaseId(null);
    setViewMode('LIST');
  };

  return (
    <div className="h-full overflow-y-auto bg-[#0a0a0c]">
      <div className="mx-auto max-w-7xl">
        {viewMode === 'LIST' ? (
          <ReleaseList user={user} onSelectDetail={handleSelectRelease} />
        ) : (
          <div className="p-6">
            {selectedReleaseId && (
              <ReleaseDetailView 
                releaseId={selectedReleaseId} 
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

export default ReleasePage;
