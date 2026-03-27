import React from 'react';
import IncidentList from './components/IncidentList';

const IncidentPage: React.FC<{ user: any }> = ({ user }) => {
  return (
    <div className="h-full overflow-y-auto bg-[#121212]">
      <div className="mx-auto max-w-7xl">
        <IncidentList user={user} />
      </div>
    </div>
  );
};

export default IncidentPage;
