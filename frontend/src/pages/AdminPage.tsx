import { useState } from 'react';
import CustomerManagement from '../components/admin/CustomerManagement';
import UserManagement from '../components/admin/UserManagement';
import CodeManagement from '../components/admin/CodeManagement';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'tenants' | 'users' | 'codes'>('tenants');

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
  const headers = () => ({ 
    'Content-Type': 'application/json', 
    'Authorization': `Bearer ${localStorage.getItem('itsm_token')}` 
  });

  return (
    <div className="admin-page-container">
      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '0', marginBottom: '2rem', borderBottom: '2px solid #333' }}>
        <button 
          type="button" 
          onClick={() => setActiveTab('tenants')} 
          style={{ padding: '0.8rem 2rem', border: 'none', backgroundColor: 'transparent', color: activeTab === 'tenants' ? '#339af0' : '#888', fontWeight: activeTab === 'tenants' ? 'bold' : 'normal', borderBottom: activeTab === 'tenants' ? '2px solid #339af0' : 'none', cursor: 'pointer', fontSize: '1rem', marginBottom: '-2px' }}>
          🏢 고객사 관리
        </button>
        <button 
          type="button" 
          onClick={() => setActiveTab('users')} 
          style={{ padding: '0.8rem 2rem', border: 'none', backgroundColor: 'transparent', color: activeTab === 'users' ? '#339af0' : '#888', fontWeight: activeTab === 'users' ? 'bold' : 'normal', borderBottom: activeTab === 'users' ? '2px solid #339af0' : 'none', cursor: 'pointer', fontSize: '1rem', marginBottom: '-2px' }}>
          👤 사용자 관리
        </button>
        <button 
          type="button" 
          onClick={() => setActiveTab('codes')} 
          style={{ padding: '0.8rem 2rem', border: 'none', backgroundColor: 'transparent', color: activeTab === 'codes' ? '#339af0' : '#888', fontWeight: activeTab === 'codes' ? 'bold' : 'normal', borderBottom: activeTab === 'codes' ? '2px solid #339af0' : 'none', cursor: 'pointer', fontSize: '1rem', marginBottom: '-2px' }}>
          🔢 공통 코드 관리
        </button>
      </div>

      <div className="admin-tab-content">
        {activeTab === 'tenants' && (
          <CustomerManagement 
            apiUrl={apiUrl} 
            headers={headers} 
          />
        )}
        {activeTab === 'users' && (
          <UserManagement 
            apiUrl={apiUrl} 
            headers={headers} 
          />
        )}
        {activeTab === 'codes' && (
          <CodeManagement 
            apiUrl={apiUrl} 
            headers={headers} 
          />
        )}
      </div>
    </div>
  );
}
