import { useState, useEffect, useCallback } from 'react';
import AdminModal from './AdminModal';

export default function CodeManagement({ apiUrl, headers }: any) {
  const [codes, setCodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [sort, setSort] = useState({ field: 'groupCode', dir: 'asc' });

  const [showForm, setShowForm] = useState(false);
  const [editingCode, setEditingCode] = useState<any | null>(null);
  const [codeForm, setCodeForm] = useState({ codeId: '', groupCode: '', codeName: '', sortOrder: 1, isUse: true });
  
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '', type: 'info' as any, onConfirm: () => {} });

  const fetchCodes = useCallback(async () => {
    setLoading(true);
    try {
      // For multi-sort (default), we handle it by groupCode,sortOrder if field is groupCode
      const sortParam = sort.field === 'groupCode' 
        ? `groupCode,${sort.dir}&sort=sortOrder,asc` 
        : `${sort.field},${sort.dir}`;
        
      const res = await fetch(`${apiUrl}/api/codes?page=${page}&size=15&search=${encodeURIComponent(search)}&sort=${sortParam}`, { headers: headers() });
      if (res.ok) {
        const data = await res.json();
        setCodes(data.content || []);
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements);
      }
    } catch (e) {
      console.error('Failed to fetch codes:', e);
    } finally {
      setLoading(false);
    }
  }, [apiUrl, headers, page, search, sort]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCodes();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchCodes]);

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
      const res = await fetch(`${apiUrl}/api/codes`, { method: 'POST', headers: headers(), body: JSON.stringify(codeForm) });
      if (res.ok) {
        setModal({ isOpen: true, title: '성공', message: '공통 코드가 생성되었습니다.', type: 'success', onConfirm: () => { setModal({ ...modal, isOpen: false }); setShowForm(false); fetchCodes(); } });
        setCodeForm({ codeId: '', groupCode: '', codeName: '', sortOrder: 1, isUse: true });
      }
    } catch (e) {
      setModal({ isOpen: true, title: '오류', message: '네트워크 오류가 발생했습니다.', type: 'danger', onConfirm: () => setModal({ ...modal, isOpen: false }) });
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCode) return;
    try {
      const res = await fetch(`${apiUrl}/api/codes/${editingCode.codeId}`, { 
        method: 'PATCH', 
        headers: headers(), 
        body: JSON.stringify(editingCode) 
      });
      if (res.ok) {
        setModal({ isOpen: true, title: '수정 완료', message: '코드가 성공적으로 수정되었습니다.', type: 'success', onConfirm: () => { setModal({ ...modal, isOpen: false }); setEditingCode(null); fetchCodes(); } });
      }
    } catch (e) {
      setModal({ isOpen: true, title: '오류', message: '수정 중 오류가 발생했습니다.', type: 'danger', onConfirm: () => setModal({ ...modal, isOpen: false }) });
    }
  };

  const confirmDelete = (e: React.MouseEvent, codeId: string) => {
    e.stopPropagation();
    setModal({ 
      isOpen: true, 
      title: '코드 삭제 확인', 
      message: `정말 코드(${codeId})를 삭제하시겠습니까?`, 
      type: 'danger', 
      onConfirm: () => handleDelete(codeId) 
    });
  };

  const handleDelete = async (codeId: string) => {
    setModal({ ...modal, isOpen: false });
    try {
      const res = await fetch(`${apiUrl}/api/codes/${codeId}`, { method: 'DELETE', headers: headers() });
      if (res.ok) {
        setModal({ isOpen: true, title: '삭제 성공', message: '코드가 정상적으로 삭제되었습니다.', type: 'success', onConfirm: () => { setModal({ ...modal, isOpen: false }); fetchCodes(); } });
      }
    } catch (e) {
      setModal({ isOpen: true, title: '오류', message: '오류가 발생했습니다.', type: 'danger', onConfirm: () => setModal({ ...modal, isOpen: false }) });
    }
  };

  return (
    <div>
      <AdminModal {...modal} onCancel={() => setModal({ ...modal, isOpen: false })} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h3 style={{ color: '#fff', margin: 0 }}>시스템 공통 코드 ({totalElements})</h3>
        <div style={{ display: 'flex', gap: '0.8rem', flex: 1, justifyContent: 'flex-end', minWidth: '300px' }}>
          <input 
            placeholder="코드명, ID, 그룹 검색..." 
            value={search} 
            onChange={e => { setSearch(e.target.value); setPage(0); }} 
            style={{ padding: '0.7rem 1rem', borderRadius: '8px', border: '1px solid #444', backgroundColor: '#1e1e1e', color: '#fff', width: '250px' }} 
          />
          <button onClick={() => { setShowForm(!showForm); setEditingCode(null); }} style={{ padding: '0.7rem 1.5rem', borderRadius: '8px', border: 'none', backgroundColor: '#339af0', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>
            {showForm ? '✕ 취소' : '+ 코드 추가'}
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} style={{ backgroundColor: '#1e1e1e', padding: '1.5rem', borderRadius: '8px', border: '1px solid #444', marginBottom: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', alignItems: 'flex-end' }}>
          <input required placeholder="코드 ID" value={codeForm.codeId} onChange={e => setCodeForm({...codeForm, codeId: e.target.value})} style={{ padding: '0.7rem', borderRadius: '6px', backgroundColor: '#2c2c2c', color: '#fff', border: '1px solid #555' }} />
          <input required placeholder="그룹 코드" value={codeForm.groupCode} onChange={e => setCodeForm({...codeForm, groupCode: e.target.value})} style={{ padding: '0.7rem', borderRadius: '6px', backgroundColor: '#2c2c2c', color: '#fff', border: '1px solid #555' }} />
          <input required placeholder="코드명" value={codeForm.codeName} onChange={e => setCodeForm({...codeForm, codeName: e.target.value})} style={{ padding: '0.7rem', borderRadius: '6px', backgroundColor: '#2c2c2c', color: '#fff', border: '1px solid #555' }} />
          <input type="number" placeholder="순서" value={codeForm.sortOrder} onChange={e => setCodeForm({...codeForm, sortOrder: parseInt(e.target.value)})} style={{ padding: '0.7rem', borderRadius: '6px', backgroundColor: '#2c2c2c', color: '#fff', border: '1px solid #555' }} />
          <button type="submit" style={{ padding: '0.7rem', borderRadius: '6px', border: 'none', backgroundColor: '#51cf66', color: '#000', fontWeight: 'bold', cursor: 'pointer' }}>코드 등록</button>
        </form>
      )}

      {editingCode && (
        <form onSubmit={handleUpdate} style={{ backgroundColor: '#1e1e1e', padding: '1.5rem', borderRadius: '8px', border: '1px solid #339af0', marginBottom: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', alignItems: 'flex-end' }}>
          <div style={{ color: '#aaa', fontSize: '0.8rem' }}>수정 중: {editingCode.codeId}</div>
          <input disabled value={editingCode.groupCode} style={{ padding: '0.7rem', borderRadius: '6px', backgroundColor: '#2c2c2c', color: '#888', border: '1px solid #444' }} />
          <input required placeholder="코드명" value={editingCode.codeName} onChange={e => setEditingCode({...editingCode, codeName: e.target.value})} style={{ padding: '0.7rem', borderRadius: '6px', backgroundColor: '#2c2c2c', color: '#fff', border: '1px solid #555' }} />
          <input type="number" placeholder="순서" value={editingCode.sortOrder} onChange={e => setEditingCode({...editingCode, sortOrder: parseInt(e.target.value)})} style={{ padding: '0.7rem', borderRadius: '6px', backgroundColor: '#2c2c2c', color: '#fff', border: '1px solid #555' }} />
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="submit" style={{ padding: '0.7rem', borderRadius: '6px', border: 'none', backgroundColor: '#339af0', color: '#fff', fontWeight: 'bold', cursor: 'pointer', flex: 1 }}>저장</button>
            <button type="button" onClick={() => setEditingCode(null)} style={{ padding: '0.7rem', borderRadius: '6px', border: '1px solid #444', backgroundColor: 'transparent', color: '#888', cursor: 'pointer', flex: 1 }}>취소</button>
          </div>
        </form>
      )}

      {loading ? (
        <div style={{ color: '#888', textAlign: 'center', padding: '2rem' }}>코드 데이터 로딩 및 정렬 중...</div>
      ) : (
        <>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#2c2c2c', color: '#888', textAlign: 'left' }}>
                <th onClick={() => handleSort('groupCode')} style={{ padding: '1rem', cursor: 'pointer' }}>그룹 {getSortIcon('groupCode')}</th>
                <th onClick={() => handleSort('codeId')} style={{ padding: '1rem', cursor: 'pointer' }}>코드 ID {getSortIcon('codeId')}</th>
                <th onClick={() => handleSort('codeName')} style={{ padding: '1rem', cursor: 'pointer' }}>코드명 {getSortIcon('codeName')}</th>
                <th onClick={() => handleSort('sortOrder')} style={{ padding: '1rem', cursor: 'pointer' }}>순서 {getSortIcon('sortOrder')}</th>
                <th style={{ padding: '1rem', textAlign: 'center' }}>작업</th>
              </tr>
            </thead>
            <tbody>
              {codes.map((c: any) => (
                <tr key={c.codeId} style={{ borderBottom: '1px solid #333' }}>
                  <td style={{ padding: '1rem', color: '#339af0' }}>{c.groupCode}</td>
                  <td style={{ padding: '1rem', color: '#888' }}>{c.codeId}</td>
                  <td style={{ padding: '1rem', color: '#fff' }}>{c.codeName}</td>
                  <td style={{ padding: '1rem', color: '#aaa' }}>{c.sortOrder}</td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                      <button onClick={() => { setEditingCode({...c}); setShowForm(false); }} style={{ padding: '0.4rem 0.8rem', backgroundColor: '#444', border: 'none', borderRadius: '4px', color: '#fff', cursor: 'pointer' }}>수정</button>
                      <button onClick={(e) => confirmDelete(e, c.codeId)} style={{ padding: '0.4rem 0.8rem', backgroundColor: '#c92a2a', border: 'none', borderRadius: '4px', color: '#fff', cursor: 'pointer' }}>삭제</button>
                    </div>
                  </td>
                </tr>
              ))}
              {codes.length === 0 && (
                <tr><td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: '#666' }}>검색된 코드가 없습니다.</td></tr>
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
