import { useState, useEffect, useCallback } from 'react';
import AdminModal from './AdminModal';

export default function CustomerManagement({ apiUrl, headers }: any) {
  const [tenants, setTenants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [sort, setSort] = useState({ field: 'createdAt', dir: 'desc' });
  
  const [showForm, setShowForm] = useState(false);
  const [editingTenant, setEditingTenant] = useState<any | null>(null);
  const [tenantForm, setTenantForm] = useState({ tenantId: '', tenantName: '', tier: 'Standard' });
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '', type: 'info' as any, onConfirm: () => {} });

  const fetchTenants = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/api/admin/tenants?page=${page}&size=10&search=${encodeURIComponent(search)}&sort=${sort.field},${sort.dir}`, { headers: headers() });
      if (res.ok) {
        const data = await res.json();
        setTenants(data.content);
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements);
      }
    } catch (e) {
      console.error('Failed to fetch tenants:', e);
    } finally {
      setLoading(false);
    }
  }, [apiUrl, headers, page, search, sort]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTenants();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchTenants]);

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
      const res = await fetch(`${apiUrl}/api/admin/tenants`, { method: 'POST', headers: headers(), body: JSON.stringify(tenantForm) });
      if (res.ok) { 
        setModal({ isOpen: true, title: '성공', message: '고객사가 등록되었습니다.', type: 'success', onConfirm: () => { setModal({ ...modal, isOpen: false }); setShowForm(false); fetchTenants(); } });
        setTenantForm({ tenantId: '', tenantName: '', tier: 'Standard' });
      }
    } catch (e) { 
      setModal({ isOpen: true, title: '오류', message: '오류가 발생했습니다.', type: 'danger', onConfirm: () => setModal({ ...modal, isOpen: false }) });
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
        setModal({ isOpen: true, title: '수정 완료', message: '정보가 성공적으로 반영되었습니다.', type: 'success', onConfirm: () => { setModal({ ...modal, isOpen: false }); setEditingTenant(null); fetchTenants(); } });
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
      message: `정말 고객사(${tenantId})를 삭제하시겠습니까?`, 
      type: 'danger', 
      onConfirm: () => handleDelete(tenantId) 
    });
  };

  const handleDelete = async (tenantId: string) => {
    setModal({ ...modal, isOpen: false }); 
    try {
      const res = await fetch(`${apiUrl}/api/admin/tenants/${tenantId}`, { method: 'DELETE', headers: headers() });
      if (res.ok) {
        setModal({ isOpen: true, title: '삭제 성공', message: '정상적으로 삭제되었습니다.', type: 'success', onConfirm: () => { setModal({ ...modal, isOpen: false }); fetchTenants(); } });
      }
    } catch (e) {
      setModal({ isOpen: true, title: '오류', message: '오류가 발생했습니다.', type: 'danger', onConfirm: () => setModal({ ...modal, isOpen: false }) });
    }
  };

  const TIER_COLOR: Record<string, string> = { Premium: '#fcc419', Standard: '#339af0', Basic: '#888' };

  return (
    <div>
      <AdminModal {...modal} onCancel={() => setModal({ ...modal, isOpen: false })} />
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h3 style={{ color: '#fff', margin: 0 }}>관리 대상 고객사 ({totalElements})</h3>
        <div style={{ display: 'flex', gap: '0.8rem', flex: 1, justifyContent: 'flex-end', minWidth: '300px' }}>
          <input 
            placeholder="고객사 이름 또는 ID 검색..." 
            value={search} 
            onChange={e => { setSearch(e.target.value); setPage(0); }} 
            style={{ padding: '0.7rem 1rem', borderRadius: '8px', border: '1px solid #444', backgroundColor: '#1e1e1e', color: '#fff', width: '250px' }} 
          />
          <button onClick={() => { setShowForm(!showForm); setEditingTenant(null); }} style={{ padding: '0.7rem 1.5rem', borderRadius: '8px', border: 'none', backgroundColor: '#339af0', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>
            {showForm ? '✕ 취소' : '+ 고객사 등록'}
          </button>
        </div>
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

      {loading ? (
        <div style={{ color: '#888', textAlign: 'center', padding: '2rem' }}>데이터 로딩 및 정렬 중...</div>
      ) : (
        <>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#2c2c2c', color: '#888' }}>
                <th onClick={() => handleSort('tenantId')} style={{ padding: '1rem', textAlign: 'left', cursor: 'pointer' }}>ID {getSortIcon('tenantId')}</th>
                <th onClick={() => handleSort('tenantName')} style={{ padding: '1rem', textAlign: 'left', cursor: 'pointer' }}>이름 {getSortIcon('tenantName')}</th>
                <th onClick={() => handleSort('tier')} style={{ padding: '1rem', textAlign: 'left', cursor: 'pointer' }}>티어 {getSortIcon('tier')}</th>
                <th style={{ padding: '1rem', textAlign: 'center' }}>작업</th>
              </tr>
            </thead>
            <tbody>
              {tenants.map((t: any) => (
                <tr key={t.tenantId} style={{ borderBottom: '1px solid #333' }}>
                  <td style={{ padding: '1rem', color: '#888' }}>{t.tenantId}</td>
                  <td style={{ padding: '1rem', color: '#fff', fontWeight: 'bold' }}>{t.tenantName}</td>
                  <td style={{ padding: '1rem' }}><span style={{ backgroundColor: TIER_COLOR[t.tier], color: '#000', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 'bold' }}>{t.tier}</span></td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                      <button onClick={() => { setEditingTenant({...t}); setShowForm(false); }} style={{ padding: '0.4rem 0.8rem', backgroundColor: '#444', border: 'none', borderRadius: '4px', color: '#fff', cursor: 'pointer' }}>수정</button>
                      <button onClick={(e) => confirmDelete(e, t.tenantId)} style={{ padding: '0.4rem 0.8rem', backgroundColor: '#c92a2a', border: 'none', borderRadius: '4px', color: '#fff', cursor: 'pointer' }}>삭제</button>
                    </div>
                  </td>
                </tr>
              ))}
              {tenants.length === 0 && (
                <tr><td colSpan={4} style={{ padding: '3rem', textAlign: 'center', color: '#666' }}>데이터가 없습니다.</td></tr>
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
