import React from 'react';
import ReleaseList from './components/ReleaseList';

const ReleasePage: React.FC<{ user: any }> = ({ user }) => {
  return (
    <div className="h-full overflow-y-auto bg-[#0a0a0c]">
      <div className="mx-auto max-w-7xl">
        <ReleaseList user={user} />
      </div>
    </div>
  );
};

export default ReleasePage;
