import React from 'react';
import ChangeList from './components/ChangeList';

const ChangePage: React.FC<{ user: any }> = ({ user }) => {
  return (
    <div className="h-full overflow-y-auto bg-[#0a0a0c]">
      <div className="mx-auto max-w-7xl">
        <ChangeList user={user} />
      </div>
    </div>
  );
};

export default ChangePage;
