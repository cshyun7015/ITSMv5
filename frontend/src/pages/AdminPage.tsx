import { useState, useEffect } from 'react';
import CustomerManagement from '../components/admin/CustomerManagement';
import UserManagement from '../components/admin/UserManagement';
import CodeManagement from '../components/admin/CodeManagement';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'tenants' | 'users' | 'codes'>('tenants');
  const [tenants, setTenants] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [codes, setCodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
  const headers = () => ({ 
    'Content-Type': 'application/json', 
    'Authorization': `Bearer ${localStorage.getItem('itsm_token')}` 
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [tRes, uRes, cRes] = await Promise.all([
        fetch(`${apiUrl}/api/admin/tenants`, { headers: headers() }),
        fetch(`${apiUrl}/api/admin/users`, { headers: headers() }),
        fetch(`${apiUrl}/api/codes`, { headers: headers() })
      ]);
      if (tRes.ok) setTenants(await tRes.json());
      if (uRes.ok) setUsers(await uRes.json());
      if (cRes.ok) setCodes(await cRes.json());
    } catch (e) {
      console.error('Failed to fetch admin data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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

      {loading && <div style={{ color: '#aaa', padding: '2rem', textAlign: 'center' }}>데이터 로딩 중...</div>}

      {!loading && (
        <div className="admin-tab-content">
          {activeTab === 'tenants' && (
            <CustomerManagement 
              tenants={tenants} 
              onFetch={fetchData} 
              apiUrl={apiUrl} 
              headers={headers} 
            />
          )}
          {activeTab === 'users' && (
            <UserManagement 
              users={users} 
              tenants={tenants} 
              onFetch={fetchData} 
              apiUrl={apiUrl} 
              headers={headers} 
            />
          )}
          {activeTab === 'codes' && (
            <CodeManagement 
              codes={codes} 
              onFetch={fetchData} 
              apiUrl={apiUrl} 
              headers={headers} 
            />
          )}
        </div>
      )}
    </div>
  );
}
