import { useState } from 'react';
import AdminModal from './AdminModal';

export default function UserManagement({ users, tenants, onFetch, apiUrl, headers }: any) {
  const [showForm, setShowForm] = useState(false);
  const [userForm, setUserForm] = useState({ userId: '', userName: '', email: '', password: '', tenantId: '', role: 'ROLE_USER' });
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '', type: 'info' as any, onConfirm: () => {} });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${apiUrl}/api/admin/users`, { method: 'POST', headers: headers(), body: JSON.stringify(userForm) });
      if (res.ok) { 
        setModal({ isOpen: true, title: '성공', message: '사용자가 생성되었습니다.', type: 'success', onConfirm: () => { setModal({ ...modal, isOpen: false }); setShowForm(false); onFetch(); } });
        setUserForm({ userId: '', userName: '', email: '', password: '', tenantId: '', role: 'ROLE_USER' }); 
      } else {
        setModal({ isOpen: true, title: '오류', message: '사용자 생성에 실패했습니다.', type: 'danger', onConfirm: () => setModal({ ...modal, isOpen: false }) });
      }
    } catch (e) { 
        setModal({ isOpen: true, title: '오류', message: '오류가 발생했습니다.', type: 'danger', onConfirm: () => setModal({ ...modal, isOpen: false }) });
    }
  };

  return (
    <div>
      <AdminModal {...modal} onCancel={() => setModal({ ...modal, isOpen: false })} />
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ color: '#fff', margin: 0 }}>관리 대상 사용자 ({users.length})</h3>
        <button type="button" onClick={() => setShowForm(!showForm)} style={{ padding: '0.7rem 1.5rem', borderRadius: '8px', border: 'none', backgroundColor: '#339af0', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>
          {showForm ? '✕ 취소' : '+ 사용자 추가'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} style={{ backgroundColor: '#1e1e1e', padding: '1.5rem', borderRadius: '8px', border: '1px solid #444', marginBottom: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'flex-end' }}>
          <input required placeholder="사용자 ID" value={userForm.userId} onChange={e => setUserForm({...userForm, userId: e.target.value})} style={{ padding: '0.7rem', borderRadius: '6px', backgroundColor: '#2c2c2c', color: '#fff', border: '1px solid #555' }} />
          <input required placeholder="사용자 이름" value={userForm.userName} onChange={e => setUserForm({...userForm, userName: e.target.value})} style={{ padding: '0.7rem', borderRadius: '6px', backgroundColor: '#2c2c2c', color: '#fff', border: '1px solid #555' }} />
          <input required type="email" placeholder="이메일" value={userForm.email} onChange={e => setUserForm({...userForm, email: e.target.value})} style={{ padding: '0.7rem', borderRadius: '6px', backgroundColor: '#2c2c2c', color: '#fff', border: '1px solid #555' }} />
          <input required type="password" placeholder="비밀번호" value={userForm.password} onChange={e => setUserForm({...userForm, password: e.target.value})} style={{ padding: '0.7rem', borderRadius: '6px', backgroundColor: '#2c2c2c', color: '#fff', border: '1px solid #555' }} />
          <select required value={userForm.tenantId} onChange={e => setUserForm({...userForm, tenantId: e.target.value})} style={{ padding: '0.7rem', borderRadius: '6px', backgroundColor: '#2c2c2c', color: '#fff', border: '1px solid #555' }}>
            <option value="">-- 고객사 선택 --</option>
            {tenants.map((t: any) => <option key={t.tenantId} value={t.tenantId}>{t.tenantName}</option>)}
          </select>
          <select value={userForm.role} onChange={e => setUserForm({...userForm, role: e.target.value})} style={{ padding: '0.7rem', borderRadius: '6px', backgroundColor: '#2c2c2c', color: '#fff', border: '1px solid #555' }}>
            <option>ROLE_USER</option><option>ROLE_AGENT</option><option>ROLE_ADMIN</option>
          </select>
          <button type="submit" style={{ padding: '0.7rem', borderRadius: '6px', border: 'none', backgroundColor: '#51cf66', color: '#000', fontWeight: 'bold', cursor: 'pointer' }}>사용자 생성</button>
        </form>
      )}

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#2c2c2c', color: '#888', textAlign: 'left' }}>
            <th style={{ padding: '1rem' }}>사용자 ID</th>
            <th style={{ padding: '1rem' }}>이름 / 이메일</th>
            <th style={{ padding: '1rem' }}>고객사</th>
            <th style={{ padding: '1rem' }}>권한</th>
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
                <span style={{ color: u.tenantId === 'system' ? '#fcc419' : '#339af0' }}>{u.tenantId}</span>
              </td>
              <td style={{ padding: '1rem' }}>
                <span style={{ fontSize: '0.85rem', color: u.role === 'ROLE_ADMIN' ? '#ff6b6b' : '#aaa' }}>{u.role}</span>
              </td>
              <td style={{ padding: '1rem', textAlign: 'center' }}>
                <button type="button" style={{ padding: '0.3rem 0.6rem', backgroundColor: '#444', border: 'none', borderRadius: '4px', color: '#ddd', cursor: 'pointer' }}>상태 변경</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
