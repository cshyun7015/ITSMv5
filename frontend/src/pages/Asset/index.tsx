import React from 'react';
import AssetList from './components/AssetList';

const AssetPage: React.FC<{ user: any }> = ({ user }) => {
  return (
    <div className="h-full overflow-y-auto bg-[#0a0a0c]">
      <div className="mx-auto max-w-7xl">
        <AssetList user={user} />
      </div>
    </div>
  );
};

export default AssetPage;
