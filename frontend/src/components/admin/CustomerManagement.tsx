import { useState } from 'react';
import AdminModal from './AdminModal';

export default function CustomerManagement({ tenants, onFetch, apiUrl, headers }: any) {
  const [showForm, setShowForm] = useState(false);
  const [editingTenant, setEditingTenant] = useState<any | null>(null);
  const [tenantForm, setTenantForm] = useState({ tenantId: '', tenantName: '', tier: 'Standard' });
  
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '', type: 'info' as any, onConfirm: () => {} });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${apiUrl}/api/admin/tenants`, { method: 'POST', headers: headers(), body: JSON.stringify(tenantForm) });
      if (res.ok) { 
        setModal({ isOpen: true, title: '성공', message: '고객사가 등록되었습니다.', type: 'success', onConfirm: () => { setModal({ ...modal, isOpen: false }); setShowForm(false); onFetch(); } });
        setTenantForm({ tenantId: '', tenantName: '', tier: 'Standard' });
      } else {
        setModal({ isOpen: true, title: '오류', message: '등록에 실패했습니다.', type: 'danger', onConfirm: () => setModal({ ...modal, isOpen: false }) });
      }
    } catch (e) { 
      setModal({ isOpen: true, title: '오류', message: '네트워크 상의 오류가 발생했습니다.', type: 'danger', onConfirm: () => setModal({ ...modal, isOpen: false }) });
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTenant) return;
    try {
      const res = await fetch(`${apiUrl}/api/admin/tenants/${editingTenant.tenantId}`, { 
        method: 'PATCH', 
        headers: headers(), 
        body: JSON.stringify({ tenantName: editingTenant.tenantName, tier: editingTenant.tier }) 
      });
      if (res.ok) { 
        setModal({ isOpen: true, title: '수정 완료', message: '정보가 성공적으로 반영되었습니다.', type: 'success', onConfirm: () => { setModal({ ...modal, isOpen: false }); setEditingTenant(null); onFetch(); } });
      }
    } catch (e) { 
      setModal({ isOpen: true, title: '오류', message: '수정 중 오류가 발생했습니다.', type: 'danger', onConfirm: () => setModal({ ...modal, isOpen: false }) });
    }
  };

  const confirmDelete = (e: React.MouseEvent, tenantId: string) => {
    e.stopPropagation();
    setModal({ 
      isOpen: true, 
      title: '삭제 확인', 
      message: `정말 고객사(${tenantId})를 삭제하시겠습니까? 관련 데이터가 모두 삭제될 수 있습니다.`, 
      type: 'danger', 
      onConfirm: () => handleDelete(tenantId) 
    });
  };

  const handleDelete = async (tenantId: string) => {
    setModal({ ...modal, isOpen: false }); 
    try {
      const res = await fetch(`${apiUrl}/api/admin/tenants/${tenantId}`, { method: 'DELETE', headers: headers() });
      if (res.ok) {
        setModal({ isOpen: true, title: '삭제 성공', message: '고객사가 정상적으로 삭제되었습니다.', type: 'success', onConfirm: () => { setModal({ ...modal, isOpen: false }); onFetch(); } });
      } else {
        setModal({ isOpen: true, title: '삭제 실패', message: '서버 오류로 삭제하지 못했습니다.', type: 'danger', onConfirm: () => setModal({ ...modal, isOpen: false }) });
      }
    } catch (e) {
      setModal({ isOpen: true, title: '오류', message: '네트워크 상의 오류가 발생했습니다.', type: 'danger', onConfirm: () => setModal({ ...modal, isOpen: false }) });
    }
  };

  const TIER_COLOR: Record<string, string> = { Premium: '#fcc419', Standard: '#339af0', Basic: '#888' };

  return (
    <div>
      <AdminModal {...modal} onCancel={() => setModal({ ...modal, isOpen: false })} />
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ color: '#fff', margin: 0 }}>관리 대상 고객사 ({tenants.length})</h3>
        <button type="button" onClick={() => { setShowForm(!showForm); setEditingTenant(null); }} style={{ padding: '0.7rem 1.5rem', borderRadius: '8px', border: 'none', backgroundColor: '#339af0', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>
          {showForm ? '✕ 취소' : '+ 고객사 등록'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} style={{ backgroundColor: '#1e1e1e', padding: '1.5rem', borderRadius: '8px', border: '1px solid #444', marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <input required placeholder="고객사 ID" value={tenantForm.tenantId} onChange={e => setTenantForm({...tenantForm, tenantId: e.target.value})} style={{ padding: '0.7rem', borderRadius: '6px', border: '1px solid #555', backgroundColor: '#2c2c2c', color: '#fff' }} />
          <input required placeholder="고객사 이름" value={tenantForm.tenantName} onChange={e => setTenantForm({...tenantForm, tenantName: e.target.value})} style={{ padding: '0.7rem', borderRadius: '6px', border: '1px solid #555', backgroundColor: '#2c2c2c', color: '#fff' }} />
          <select value={tenantForm.tier} onChange={e => setTenantForm({...tenantForm, tier: e.target.value})} style={{ padding: '0.7rem', borderRadius: '6px', border: '1px solid #555', backgroundColor: '#2c2c2c', color: '#fff' }}>
            <option>Premium</option><option>Standard</option><option>Basic</option>
          </select>
          <button type="submit" style={{ padding: '0.7rem 1.5rem', borderRadius: '6px', border: 'none', backgroundColor: '#51cf66', color: '#000', fontWeight: 'bold', cursor: 'pointer' }}>등록</button>
        </form>
      )}

      {editingTenant && (
        <form onSubmit={handleUpdate} style={{ backgroundColor: '#1e1e1e', padding: '1.5rem', borderRadius: '8px', border: '1px solid #339af0', marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div style={{ flex: 1 }}>
            <label style={{ color: '#aaa', fontSize: '0.8rem', display: 'block' }}>수정 중: {editingTenant.tenantId}</label>
            <input required placeholder="고객사 이름" value={editingTenant.tenantName} onChange={e => setEditingTenant({...editingTenant, tenantName: e.target.value})} style={{ padding: '0.7rem', borderRadius: '6px', border: '1px solid #555', backgroundColor: '#2c2c2c', color: '#fff', width: '100%', marginTop: '0.3rem' }} />
          </div>
          <select value={editingTenant.tier} onChange={e => setEditingTenant({...editingTenant, tier: e.target.value})} style={{ padding: '0.7rem', borderRadius: '6px', border: '1px solid #555', backgroundColor: '#2c2c2c', color: '#fff' }}>
            <option>Premium</option><option>Standard</option><option>Basic</option>
          </select>
          <button type="submit" style={{ padding: '0.7rem 1.5rem', borderRadius: '6px', border: 'none', backgroundColor: '#339af0', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>저장</button>
          <button type="button" onClick={() => setEditingTenant(null)} style={{ padding: '0.7rem 1.5rem', borderRadius: '6px', border: '1px solid #444', backgroundColor: 'transparent', color: '#888', cursor: 'pointer' }}>취소</button>
        </form>
      )}

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead><tr style={{ backgroundColor: '#2c2c2c', color: '#888' }}><th style={{ padding: '1rem', textAlign: 'left' }}>ID</th><th style={{ padding: '1rem', textAlign: 'left' }}>이름</th><th style={{ padding: '1rem', textAlign: 'left' }}>티어</th><th style={{ padding: '1rem', textAlign: 'center' }}>작업</th></tr></thead>
        <tbody>
          {tenants.map((t: any) => (
            <tr key={t.tenantId} style={{ borderBottom: '1px solid #333' }}>
              <td style={{ padding: '1rem', color: '#888' }}>{t.tenantId}</td>
              <td style={{ padding: '1rem', color: '#fff', fontWeight: 'bold' }}>{t.tenantName}</td>
              <td style={{ padding: '1rem' }}><span style={{ backgroundColor: TIER_COLOR[t.tier], color: '#000', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 'bold' }}>{t.tier}</span></td>
              <td style={{ padding: '1rem', textAlign: 'center' }}>
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                  <button type="button" onClick={() => { setEditingTenant({...t}); setShowForm(false); }} style={{ padding: '0.4rem 0.8rem', backgroundColor: '#444', border: 'none', borderRadius: '4px', color: '#fff', cursor: 'pointer' }}>수정</button>
                  <button type="button" onClick={(e) => confirmDelete(e, t.tenantId)} style={{ padding: '0.4rem 0.8rem', backgroundColor: '#c92a2a', border: 'none', borderRadius: '4px', color: '#fff', cursor: 'pointer' }}>삭제</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
