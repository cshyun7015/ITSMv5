import { useState } from 'react';
import CustomerManagement from '../components/admin/CustomerManagement';
import UserManagement from '../components/admin/UserManagement';
import CodeManagement from '../components/admin/CodeManagement';

export default function AdminPage({ user }: { user: any }) {
  const [activeTab, setActiveTab] = useState('CUSTOMERS');
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
  const token = localStorage.getItem('itsm_token');

  const headers = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  });

  const tabs = [
    { id: 'CUSTOMERS', label: '🏢 고객사 관리' },
    { id: 'USERS', label: '👤 사용자 관리' },
    { id: 'CODES', label: '🔢 공통 코드 관리' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'CUSTOMERS': return <CustomerManagement apiUrl={apiUrl} headers={headers} />;
      case 'USERS': return <UserManagement apiUrl={apiUrl} headers={headers} />;
      case 'CODES': return <CodeManagement apiUrl={apiUrl} headers={headers} />;
      default: return null;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '2px solid #333', overflowX: 'auto' }}>
        {tabs.map(tab => (
          <button 
            key={tab.id}
            type="button" 
            onClick={() => setActiveTab(tab.id)} 
            style={{ 
              padding: '1rem 1.5rem', 
              border: 'none', 
              backgroundColor: 'transparent', 
              color: activeTab === tab.id ? '#339af0' : '#888', 
              fontWeight: activeTab === tab.id ? 'bold' : 'normal', 
              borderBottom: activeTab === tab.id ? '3px solid #339af0' : '3px solid transparent', 
              cursor: 'pointer', 
              fontSize: '1rem', 
              marginBottom: '-2px',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s'
            }}>
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ backgroundColor: '#1a1a1a', padding: '1.5rem', borderRadius: '12px', border: '1px solid #333' }}>
        {renderTabContent()}
      </div>
    </div>
  );
}
