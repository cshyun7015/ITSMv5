import React from 'react';
import CIList from './components/CIList';

const CIPage: React.FC<{ user: any }> = ({ user }) => {
  return (
    <div className="h-full overflow-y-auto bg-[#0a0a0c]">
      <div className="mx-auto max-w-7xl">
        <CIList user={user} />
      </div>
    </div>
  );
};

export default CIPage;
