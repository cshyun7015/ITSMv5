import React, { useState } from 'react';
import ChangeList from './components/ChangeList';
import { ChangeDetailView } from './components/ChangeDetailView';

type ViewMode = 'LIST' | 'DETAIL';

const ChangePage: React.FC<{ user: any }> = ({ user }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('LIST');
  const [selectedChangeId, setSelectedChangeId] = useState<number | null>(null);

  const handleSelectChange = (id: number) => {
    setSelectedChangeId(id);
    setViewMode('DETAIL');
  };

  const handleBack = () => {
    setSelectedChangeId(null);
    setViewMode('LIST');
  };

  return (
    <div className="h-full overflow-y-auto bg-black">
      <div className="mx-auto max-w-7xl">
        {viewMode === 'LIST' ? (
          <ChangeList user={user} onSelectDetail={handleSelectChange} />
        ) : (
          <div className="p-6">
            {selectedChangeId && (
              <ChangeDetailView 
                changeId={selectedChangeId} 
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

export default ChangePage;
