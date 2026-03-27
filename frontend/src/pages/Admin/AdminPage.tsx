import React, { useState } from 'react';
import CompanyManagement from './Company';
import UserManagement from './User';
import CodeManagement from './Code';

const AdminPage: React.FC<{ user: any }> = ({ user }) => {
  const [activeTab, setActiveTab] = useState('CUSTOMERS');

  const tabs = [
    { id: 'CUSTOMERS', label: '🏢 고객사 관리' },
    { id: 'USERS', label: '👤 사용자 관리' },
    { id: 'CODES', label: '🔢 공통 코드 관리' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'CUSTOMERS': return <CompanyManagement />;
      case 'USERS': return <UserManagement />;
      case 'CODES': return <CodeManagement />;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          System Administration
        </h1>
        <p className="text-[#888]">
          Manage clients, users, and system-wide configurations.
        </p>
      </header>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b-2 border-[#333] overflow-x-auto">
        {tabs.map(tab => (
          <button 
            key={tab.id}
            type="button" 
            onClick={() => setActiveTab(tab.id)} 
            className={`px-6 py-4 text-sm font-bold transition-all border-b-4 -mb-[2px] whitespace-nowrap ${
              activeTab === tab.id 
                ? 'text-[#339af0] border-[#339af0]' 
                : 'text-[#888] border-transparent hover:text-white hover:border-[#444]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-[#333] bg-[#1a1a1a] p-8 shadow-xl">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default AdminPage;
