import React, { useState } from 'react';
import ProblemList from './components/ProblemList';
import { ProblemDetailView } from './components/ProblemDetailView';

type ViewMode = 'LIST' | 'DETAIL';

const ProblemPage: React.FC<{ user: any }> = ({ user }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('LIST');
  const [selectedProblemId, setSelectedProblemId] = useState<number | null>(null);

  const handleSelectProblem = (id: number) => {
    setSelectedProblemId(id);
    setViewMode('DETAIL');
  };

  const handleBack = () => {
    setSelectedProblemId(null);
    setViewMode('LIST');
  };

  return (
    <div className="h-full overflow-y-auto bg-[#121212]">
      <div className="mx-auto max-w-7xl">
        {viewMode === 'LIST' ? (
          <ProblemList user={user} onSelectDetail={handleSelectProblem} />
        ) : (
          <div className="p-6">
            {selectedProblemId && (
              <ProblemDetailView 
                problemId={selectedProblemId} 
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

export default ProblemPage;
