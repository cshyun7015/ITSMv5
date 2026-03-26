import { useState, useEffect, useCallback } from 'react';
import AdminModal from './AdminModal';

export default function UserManagement({ apiUrl, headers }: any) {
  const [users, setUsers] = useState<any[]>([]);
  const [tenants, setTenants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [sort, setSort] = useState({ field: 'userId', dir: 'asc' });

  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [userForm, setUserForm] = useState({ userId: '', userName: '', email: '', password: '', tenantId: '', role: 'ROLE_USER' });
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '', type: 'info' as any, onConfirm: () => {} });

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/api/admin/users?page=${page}&size=10&search=${encodeURIComponent(search)}&sort=${sort.field},${sort.dir}`, { headers: headers() });
      if (res.ok) {
        const data = await res.json();
        setUsers(data.content);
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements);
      }
    } catch (e) {
      console.error('Failed to fetch users:', e);
    } finally {
      setLoading(false);
    }
  }, [apiUrl, headers, page, search, sort]);

  const fetchTenants = useCallback(async () => {
    try {
      const res = await fetch(`${apiUrl}/api/admin/tenants?size=100`, { headers: headers() });
      if (res.ok) {
        const data = await res.json();
        setTenants(data.content || []);
      }
    } catch (e) {
      console.error('Failed to fetch tenants for user mapping:', e);
    }
  }, [apiUrl, headers]);

  useEffect(() => {
    fetchTenants();
  }, [fetchTenants]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchUsers]);

  const handleSort = (field: string) => {
    const isSame = sort.field === field;
    setSort({ field, dir: isSame ? (sort.dir === 'asc' ? 'desc' : 'asc') : 'asc' });
    setPage(0);
  };

  const getSortIcon = (field: string) => {
    if (sort.field !== field) return '↕️';
    return sort.dir === 'asc' ? '🔼' : '🔽';
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${apiUrl}/api/admin/users`, { method: 'POST', headers: headers(), body: JSON.stringify(userForm) });
      if (res.ok) { 
        setModal({ isOpen: true, title: '성공', message: '사용자가 생성되었습니다.', type: 'success', onConfirm: () => { setModal({ ...modal, isOpen: false }); setShowForm(false); fetchUsers(); } });
        setUserForm({ userId: '', userName: '', email: '', password: '', tenantId: '', role: 'ROLE_USER' }); 
      }
    } catch (e) { 
        setModal({ isOpen: true, title: '오류', message: '오류가 발생했습니다.', type: 'danger', onConfirm: () => setModal({ ...modal, isOpen: false }) });
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    try {
      const payload = { ...editingUser };
      if (!payload.password) delete payload.password;
      
      const res = await fetch(`${apiUrl}/api/admin/users/${editingUser.userId}`, { 
        method: 'PATCH', 
        headers: headers(), 
        body: JSON.stringify(payload) 
      });
      if (res.ok) { 
        setModal({ isOpen: true, title: '수정 완료', message: '사용자 정보가 성공적으로 반영되었습니다.', type: 'success', onConfirm: () => { setModal({ ...modal, isOpen: false }); setEditingUser(null); fetchUsers(); } });
      }
    } catch (e) { 
      setModal({ isOpen: true, title: '오류', message: '수정 중 오류가 발생했습니다.', type: 'danger', onConfirm: () => setModal({ ...modal, isOpen: false }) });
    }
  };

  const confirmDelete = (e: React.MouseEvent, userId: string) => {
    e.stopPropagation();
    setModal({ 
      isOpen: true, 
      title: '삭제 확인', 
      message: `정말 사용자(${userId})를 삭제하시겠습니까?`, 
      type: 'danger', 
      onConfirm: () => handleDelete(userId) 
    });
  };

  const handleDelete = async (userId: string) => {
    setModal({ ...modal, isOpen: false }); 
    try {
      const res = await fetch(`${apiUrl}/api/admin/users/${userId}`, { method: 'DELETE', headers: headers() });
      if (res.ok) {
        setModal({ isOpen: true, title: '삭제 성공', message: '사용자가 정상적으로 삭제되었습니다.', type: 'success', onConfirm: () => { setModal({ ...modal, isOpen: false }); fetchUsers(); } });
      }
    } catch (e) {
      setModal({ isOpen: true, title: '오류', message: '오류가 발생했습니다.', type: 'danger', onConfirm: () => setModal({ ...modal, isOpen: false }) });
    }
  };

  return (
    <div>
      <AdminModal {...modal} onCancel={() => setModal({ ...modal, isOpen: false })} />
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h3 style={{ color: '#fff', margin: 0 }}>관리 대상 사용자 ({totalElements})</h3>
        <div style={{ display: 'flex', gap: '0.8rem', flex: 1, justifyContent: 'flex-end', minWidth: '300px' }}>
          <input 
            placeholder="이름, ID, 이메일 검색..." 
            value={search} 
            onChange={e => { setSearch(e.target.value); setPage(0); }} 
            style={{ padding: '0.7rem 1rem', borderRadius: '8px', border: '1px solid #444', backgroundColor: '#1e1e1e', color: '#fff', width: '250px' }} 
          />
          <button onClick={() => { setShowForm(!showForm); setEditingUser(null); }} style={{ padding: '0.7rem 1.5rem', borderRadius: '8px', border: 'none', backgroundColor: '#339af0', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>
            {showForm ? '✕ 취소' : '+ 사용자 추가'}
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} style={{ backgroundColor: '#1e1e1e', padding: '1.5rem', borderRadius: '8px', border: '1px solid #444', marginBottom: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'flex-end' }}>
          <input required placeholder="사용자 ID" value={userForm.userId} onChange={e => setUserForm({...userForm, userId: e.target.value})} style={{ padding: '0.7rem', borderRadius: '6px', backgroundColor: '#2c2c2c', color: '#fff', border: '1px solid #555' }} />
          <input required placeholder="사용자 이름" value={userForm.userName} onChange={e => setUserForm({...userForm, userName: e.target.value})} style={{ padding: '0.7rem', borderRadius: '6px', backgroundColor: '#2c2c2c', color: '#fff', border: '1px solid #555' }} />
          <input required type="email" placeholder="이메일" value={userForm.email} onChange={e => setUserForm({...userForm, email: e.target.value})} style={{ padding: '0.7rem', borderRadius: '6px', backgroundColor: '#2c2c2c', color: '#fff', border: '1px solid #555' }} />
          <input required type="password" placeholder="비밀번호" value={userForm.password} onChange={e => setUserForm({...userForm, password: e.target.value})} style={{ padding: '0.7rem', borderRadius: '6px', backgroundColor: '#2c2c2c', color: '#fff', border: '1px solid #555' }} />
          <select required value={userForm.tenantId} onChange={e => setUserForm({...userForm, tenantId: e.target.value})} style={{ padding: '0.7rem', borderRadius: '6px', backgroundColor: '#2c2c2c', color: '#fff', border: '1px solid #555' }}>
            <option value="">-- 고객사 선택 --</option>
            <option value="system">System (CSP)</option>
            {tenants.map((t: any) => <option key={t.tenantId} value={t.tenantId}>{t.tenantName}</option>)}
          </select>
          <select value={userForm.role} onChange={e => setUserForm({...userForm, role: e.target.value})} style={{ padding: '0.7rem', borderRadius: '6px', backgroundColor: '#2c2c2c', color: '#fff', border: '1px solid #555' }}>
            <option>ROLE_USER</option><option>ROLE_AGENT</option><option>ROLE_ADMIN</option>
          </select>
          <button type="submit" style={{ padding: '0.7rem', borderRadius: '6px', border: 'none', backgroundColor: '#51cf66', color: '#000', fontWeight: 'bold', cursor: 'pointer' }}>사용자 생성</button>
        </form>
      )}

      {editingUser && (
        <form onSubmit={handleUpdate} style={{ backgroundColor: '#1e1e1e', padding: '1.5rem', borderRadius: '8px', border: '1px solid #339af0', marginBottom: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'flex-end' }}>
          <div style={{ color: '#aaa', fontSize: '0.8rem' }}>수정 중: {editingUser.userId}</div>
          <input required placeholder="사용자 이름" value={editingUser.userName} onChange={e => setEditingUser({...editingUser, userName: e.target.value})} style={{ padding: '0.7rem', borderRadius: '6px', backgroundColor: '#2c2c2c', color: '#fff', border: '1px solid #555' }} />
          <input required type="email" placeholder="이메일" value={editingUser.email} onChange={e => setEditingUser({...editingUser, email: e.target.value})} style={{ padding: '0.7rem', borderRadius: '6px', backgroundColor: '#2c2c2c', color: '#fff', border: '1px solid #555' }} />
          <input type="password" placeholder="비밀번호(변경 시만 입력)" value={editingUser.password || ''} onChange={e => setEditingUser({...editingUser, password: e.target.value})} style={{ padding: '0.7rem', borderRadius: '6px', backgroundColor: '#2c2c2c', color: '#fff', border: '1px solid #555' }} />
          <select required value={editingUser.tenantId} onChange={e => setEditingUser({...editingUser, tenantId: e.target.value})} style={{ padding: '0.7rem', borderRadius: '6px', backgroundColor: '#2c2c2c', color: '#fff', border: '1px solid #555' }}>
            <option value="system">System (CSP)</option>
            {tenants.map((t: any) => <option key={t.tenantId} value={t.tenantId}>{t.tenantName}</option>)}
          </select>
          <select value={editingUser.role} onChange={e => setEditingUser({...editingUser, role: e.target.value})} style={{ padding: '0.7rem', borderRadius: '6px', backgroundColor: '#2c2c2c', color: '#fff', border: '1px solid #555' }}>
            <option>ROLE_USER</option><option>ROLE_AGENT</option><option>ROLE_ADMIN</option>
          </select>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="submit" style={{ padding: '0.7rem', borderRadius: '6px', border: 'none', backgroundColor: '#339af0', color: '#fff', fontWeight: 'bold', cursor: 'pointer', flex: 1 }}>저장</button>
            <button type="button" onClick={() => setEditingUser(null)} style={{ padding: '0.7rem', borderRadius: '6px', border: '1px solid #444', backgroundColor: 'transparent', color: '#888', cursor: 'pointer', flex: 1 }}>취소</button>
          </div>
        </form>
      )}

      {loading ? (
        <div style={{ color: '#888', textAlign: 'center', padding: '2rem' }}>데이터 로딩 및 정렬 중...</div>
      ) : (
        <>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#2c2c2c', color: '#888', textAlign: 'left' }}>
                <th onClick={() => handleSort('userId')} style={{ padding: '1rem', cursor: 'pointer' }}>사용자 ID {getSortIcon('userId')}</th>
                <th onClick={() => handleSort('userName')} style={{ padding: '1rem', cursor: 'pointer' }}>이름 / 이메일 {getSortIcon('userName')}</th>
                <th onClick={() => handleSort('tenant.tenantName')} style={{ padding: '1rem', cursor: 'pointer' }}>고객사 {getSortIcon('tenant.tenantName')}</th>
                <th onClick={() => handleSort('role')} style={{ padding: '1rem', cursor: 'pointer' }}>권한 {getSortIcon('role')}</th>
                <th style={{ padding: '1rem', textAlign: 'center' }}>작업</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u: any) => (
                <tr key={u.userId} style={{ borderBottom: '1px solid #333' }}>
                  <td style={{ padding: '1rem', color: '#888' }}>{u.userId}</td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ color: '#fff', fontWeight: 'bold' }}>{u.userName}</div>
                    <div style={{ color: '#666', fontSize: '0.85rem' }}>{u.email}</div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ color: u.tenantId === 'system' ? '#fcc419' : '#339af0' }}>
                      {u.tenant?.tenantName || u.tenantId}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ fontSize: '0.85rem', color: u.role === 'ROLE_ADMIN' ? '#ff6b6b' : '#aaa' }}>{u.role}</span>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                      <button onClick={() => { setEditingUser({...u}); setShowForm(false); }} style={{ padding: '0.4rem 0.8rem', backgroundColor: '#444', border: 'none', borderRadius: '4px', color: '#fff', cursor: 'pointer' }}>수정</button>
                      <button onClick={(e) => confirmDelete(e, u.userId)} style={{ padding: '0.4rem 0.8rem', backgroundColor: '#c92a2a', border: 'none', borderRadius: '4px', color: '#fff', cursor: 'pointer' }}>삭제</button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr><td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: '#666' }}>사용자 검색 결과가 없습니다.</td></tr>
              )}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '1.5rem' }}>
              <button disabled={page === 0} onClick={() => setPage(page - 1)} style={{ padding: '0.5rem 1rem', borderRadius: '4px', border: '1px solid #444', backgroundColor: page === 0 ? '#222' : '#333', color: page === 0 ? '#555' : '#fff', cursor: page === 0 ? 'not-allowed' : 'pointer' }}>이전</button>
              <span style={{ color: '#fff' }}>Page {page + 1} of {totalPages}</span>
              <button disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)} style={{ padding: '0.5rem 1rem', borderRadius: '4px', border: '1px solid #444', backgroundColor: page >= totalPages - 1 ? '#222' : '#333', color: page >= totalPages - 1 ? '#555' : '#fff', cursor: page >= totalPages - 1 ? 'not-allowed' : 'pointer' }}>다음</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
