import { useState, useEffect } from 'react';

export default function AdminPage({ user }: { user: any }) {
  const [activeTab, setActiveTab] = useState<'tenants' | 'users'>('tenants');
  const [tenants, setTenants] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTenantForm, setShowTenantForm] = useState(false);
  const [showUserForm, setShowUserForm] = useState(false);
  const [tenantForm, setTenantForm] = useState({ tenantId: '', tenantName: '', tier: 'Standard' });
  const [userForm, setUserForm] = useState({ userId: '', userName: '', email: '', password: '', tenantId: '', role: 'ROLE_USER' });
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';

  const headers = () => ({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('itsm_token')}` });

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [tRes, uRes] = await Promise.all([
        fetch(`${apiUrl}/api/admin/tenants`, { headers: headers() }),
        fetch(`${apiUrl}/api/admin/users`, { headers: headers() })
      ]);
      if (tRes.ok) setTenants(await tRes.json());
      if (uRes.ok) setUsers(await uRes.json());
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleCreateTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`${apiUrl}/api/admin/tenants`, { method: 'POST', headers: headers(), body: JSON.stringify(tenantForm) });
    if (res.ok) { setShowTenantForm(false); setTenantForm({ tenantId: '', tenantName: '', tier: 'Standard' }); fetchAll(); }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`${apiUrl}/api/admin/users`, { method: 'POST', headers: headers(), body: JSON.stringify(userForm) });
    if (res.ok) { setShowUserForm(false); setUserForm({ userId: '', userName: '', email: '', password: '', tenantId: '', role: 'ROLE_USER' }); fetchAll(); }
  };

  const TIER_COLOR: Record<string, string> = { Premium: '#fcc419', Standard: '#339af0', Basic: '#888' };

  return (
    <div>
      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '0', marginBottom: '2rem', borderBottom: '2px solid #333' }}>
        {(['tenants', 'users'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '0.8rem 2rem', border: 'none', backgroundColor: 'transparent', color: activeTab === tab ? '#339af0' : '#888', fontWeight: activeTab === tab ? 'bold' : 'normal', borderBottom: activeTab === tab ? '2px solid #339af0' : 'none', cursor: 'pointer', fontSize: '1rem', marginBottom: '-2px', textTransform: 'capitalize' }}>
            {tab === 'tenants' ? '🏢 Customer Tenants' : '👤 Users'}
          </button>
        ))}
      </div>

      {/* TENANTS TAB */}
      {activeTab === 'tenants' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ color: '#fff', margin: 0 }}>Managed Tenants ({tenants.length})</h3>
            <button onClick={() => setShowTenantForm(!showTenantForm)} style={{ padding: '0.7rem 1.5rem', borderRadius: '8px', border: 'none', backgroundColor: '#339af0', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>
              {showTenantForm ? '✕ Cancel' : '+ Add Tenant'}
            </button>
          </div>
          
          {showTenantForm && (
            <form onSubmit={handleCreateTenant} style={{ backgroundColor: '#1e1e1e', padding: '1.5rem', borderRadius: '8px', border: '1px solid #444', marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
              <input required placeholder="tenantId (e.g. acme_corp)" value={tenantForm.tenantId} onChange={e => setTenantForm({...tenantForm, tenantId: e.target.value})} style={{ padding: '0.7rem', borderRadius: '6px', border: '1px solid #555', backgroundColor: '#2c2c2c', color: '#fff', minWidth: '180px' }} />
              <input required placeholder="고객사 이름" value={tenantForm.tenantName} onChange={e => setTenantForm({...tenantForm, tenantName: e.target.value})} style={{ padding: '0.7rem', borderRadius: '6px', border: '1px solid #555', backgroundColor: '#2c2c2c', color: '#fff', minWidth: '180px' }} />
              <select value={tenantForm.tier} onChange={e => setTenantForm({...tenantForm, tier: e.target.value})} style={{ padding: '0.7rem', borderRadius: '6px', border: '1px solid #555', backgroundColor: '#2c2c2c', color: '#fff' }}>
                <option>Premium</option><option>Standard</option><option>Basic</option>
              </select>
              <button type="submit" style={{ padding: '0.7rem 1.5rem', borderRadius: '6px', border: 'none', backgroundColor: '#51cf66', color: '#000', fontWeight: 'bold', cursor: 'pointer' }}>등록</button>
            </form>
          )}

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#2c2c2c', color: '#888', fontSize: '0.85rem' }}>
                <th style={{ padding: '0.8rem 1rem', textAlign: 'left' }}>Tenant ID</th>
                <th style={{ padding: '0.8rem 1rem', textAlign: 'left' }}>고객사 이름</th>
                <th style={{ padding: '0.8rem 1rem', textAlign: 'center' }}>등급(Tier)</th>
                <th style={{ padding: '0.8rem 1rem', textAlign: 'center' }}>사용자 수</th>
                <th style={{ padding: '0.8rem 1rem', textAlign: 'center' }}>상태</th>
              </tr>
            </thead>
            <tbody>
              {tenants.map(t => (
                <tr key={t.tenantId} style={{ borderBottom: '1px solid #333', transition: 'background 0.15s' }}>
                  <td style={{ padding: '1rem', color: '#888', fontFamily: 'monospace' }}>{t.tenantId}</td>
                  <td style={{ padding: '1rem', color: '#fff', fontWeight: 'bold' }}>{t.tenantName}</td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <span style={{ backgroundColor: TIER_COLOR[t.tier] || '#888', color: '#000', padding: '0.3rem 0.8rem', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold' }}>{t.tier}</span>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center', color: '#fff' }}>{users.filter(u => u.tenantId === t.tenantId).length}</td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <span style={{ color: t.isActive ? '#51cf66' : '#ff6b6b', fontWeight: 'bold' }}>{t.isActive ? '✅ Active' : '❌ Inactive'}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* USERS TAB */}
      {activeTab === 'users' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ color: '#fff', margin: 0 }}>All Users ({users.length})</h3>
            <button onClick={() => setShowUserForm(!showUserForm)} style={{ padding: '0.7rem 1.5rem', borderRadius: '8px', border: 'none', backgroundColor: '#339af0', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>
              {showUserForm ? '✕ Cancel' : '+ Add User'}
            </button>
          </div>

          {showUserForm && (
            <form onSubmit={handleCreateUser} style={{ backgroundColor: '#1e1e1e', padding: '1.5rem', borderRadius: '8px', border: '1px solid #444', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
              {[['userId', 'User ID'], ['userName', '이름'], ['email', 'Email'], ['password', 'Password']].map(([field, label]) => (
                <input key={field} required placeholder={label} type={field === 'password' ? 'password' : 'text'} value={(userForm as any)[field]} onChange={e => setUserForm({...userForm, [field]: e.target.value})} style={{ padding: '0.7rem', borderRadius: '6px', border: '1px solid #555', backgroundColor: '#2c2c2c', color: '#fff', minWidth: '150px' }} />
              ))}
              <select required value={userForm.tenantId} onChange={e => setUserForm({...userForm, tenantId: e.target.value})} style={{ padding: '0.7rem', borderRadius: '6px', border: '1px solid #555', backgroundColor: '#2c2c2c', color: '#fff' }}>
                <option value="">-- 테넌트 선택 --</option>
                {tenants.map(t => <option key={t.tenantId} value={t.tenantId}>{t.tenantName}</option>)}
              </select>
              <select value={userForm.role} onChange={e => setUserForm({...userForm, role: e.target.value})} style={{ padding: '0.7rem', borderRadius: '6px', border: '1px solid #555', backgroundColor: '#2c2c2c', color: '#fff' }}>
                <option value="ROLE_USER">User</option><option value="ROLE_ADMIN">Admin</option><option value="ROLE_ENGINEER">Engineer</option>
              </select>
              <button type="submit" style={{ padding: '0.7rem 1.5rem', borderRadius: '6px', border: 'none', backgroundColor: '#51cf66', color: '#000', fontWeight: 'bold', cursor: 'pointer' }}>등록</button>
            </form>
          )}

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#2c2c2c', color: '#888', fontSize: '0.85rem' }}>
                <th style={{ padding: '0.8rem 1rem', textAlign: 'left' }}>User ID</th>
                <th style={{ padding: '0.8rem 1rem', textAlign: 'left' }}>이름</th>
                <th style={{ padding: '0.8rem 1rem', textAlign: 'left' }}>Email</th>
                <th style={{ padding: '0.8rem 1rem', textAlign: 'center' }}>테넌트</th>
                <th style={{ padding: '0.8rem 1rem', textAlign: 'center' }}>역할</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.userId} style={{ borderBottom: '1px solid #333' }}>
                  <td style={{ padding: '1rem', color: '#888', fontFamily: 'monospace' }}>{u.userId}</td>
                  <td style={{ padding: '1rem', color: '#fff', fontWeight: 'bold' }}>{u.userName}</td>
                  <td style={{ padding: '1rem', color: '#aaa' }}>{u.email}</td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <span style={{ backgroundColor: '#2c2c2c', color: '#339af0', padding: '0.2rem 0.6rem', borderRadius: '8px', fontSize: '0.8rem', fontFamily: 'monospace' }}>{u.tenantId}</span>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center', color: u.role === 'ROLE_ADMIN' ? '#fcc419' : '#51cf66', fontSize: '0.85rem', fontWeight: 'bold' }}>
                    {u.role?.replace('ROLE_', '')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
