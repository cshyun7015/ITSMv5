import React from 'react';
import ProblemList from './components/ProblemList';

const ProblemPage: React.FC<{ user: any }> = ({ user }) => {
  return (
    <div className="h-full overflow-y-auto bg-[#0a0a0c]">
      <div className="mx-auto max-w-7xl">
        <ProblemList user={user} />
      </div>
    </div>
  );
};

export default ProblemPage;
