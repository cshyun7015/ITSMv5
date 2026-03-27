import React from 'react';
import SLAList from './components/SLAList';

const SLAPage: React.FC<{ user: any }> = ({ user }) => {
  return (
    <div className="h-full overflow-y-auto bg-[#0a0a0c]">
      <div className="mx-auto max-w-7xl">
        <SLAList user={user} />
      </div>
    </div>
  );
};

export default SLAPage;
