import { useState, useEffect, useCallback } from 'react';
import AdminModal from './AdminModal';

export default function CatalogManagement({ apiUrl, headers }: any) {
  const [catalogs, setCatalogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [sort, setSort] = useState({ field: 'id', dir: 'desc' });

  const [showForm, setShowForm] = useState(false);
  const [editingCatalog, setEditingCatalog] = useState<any | null>(null);
  const [catalogForm, setCatalogForm] = useState({ 
    catalogName: '', 
    description: '', 
    category: '', 
    icon: '📋', 
    formSchema: '[]', 
    isPublished: true 
  });
  
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '', type: 'info' as any, onConfirm: () => {} });

  const fetchCatalogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/api/admin/catalogs?page=${page}&size=10&search=${encodeURIComponent(search)}&sort=${sort.field},${sort.dir}`, { headers: headers() });
      if (res.ok) {
        const data = await res.json();
        setCatalogs(data.content || []);
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements);
      }
    } catch (e) {
      console.error('Failed to fetch catalogs:', e);
    } finally {
      setLoading(false);
    }
  }, [apiUrl, headers, page, search, sort]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCatalogs();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchCatalogs]);

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
      // Validate JSON
      try { JSON.parse(catalogForm.formSchema); } catch(e) { 
        setModal({ isOpen: true, title: '형식 오류', message: 'Form Schema는 유효한 JSON 배열이어야 합니다.', type: 'danger', onConfirm: () => setModal({ ...modal, isOpen: false }) });
        return;
      }

      const res = await fetch(`${apiUrl}/api/admin/catalogs`, { method: 'POST', headers: headers(), body: JSON.stringify(catalogForm) });
      if (res.ok) {
        setModal({ isOpen: true, title: '성공', message: '카탈로그 항목이 생성되었습니다.', type: 'success', onConfirm: () => { setModal({ ...modal, isOpen: false }); setShowForm(false); fetchCatalogs(); } });
        setCatalogForm({ catalogName: '', description: '', category: '', icon: '📋', formSchema: '[]', isPublished: true });
      }
    } catch (e) {
      setModal({ isOpen: true, title: '오류', message: '오류가 발생했습니다.', type: 'danger', onConfirm: () => setModal({ ...modal, isOpen: false }) });
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCatalog) return;
    try {
      // Validate JSON
      try { JSON.parse(editingCatalog.formSchema); } catch(e) { 
        setModal({ isOpen: true, title: '형식 오류', message: 'Form Schema는 유효한 JSON 배열이어야 합니다.', type: 'danger', onConfirm: () => setModal({ ...modal, isOpen: false }) });
        return;
      }

      const res = await fetch(`${apiUrl}/api/admin/catalogs/${editingCatalog.id}`, { 
        method: 'PATCH', 
        headers: headers(), 
        body: JSON.stringify(editingCatalog) 
      });
      if (res.ok) {
        setModal({ isOpen: true, title: '수정 완료', message: '정보가 성공적으로 반영되었습니다.', type: 'success', onConfirm: () => { setModal({ ...modal, isOpen: false }); setEditingCatalog(null); fetchCatalogs(); } });
      }
    } catch (e) {
      setModal({ isOpen: true, title: '오류', message: '수정 중 오류가 발생했습니다.', type: 'danger', onConfirm: () => setModal({ ...modal, isOpen: false }) });
    }
  };

  const confirmDelete = (e: React.MouseEvent, id: number, name: string) => {
    e.stopPropagation();
    setModal({ 
      isOpen: true, 
      title: '삭제 확인', 
      message: `정말 카탈로그(${name})를 삭제하시겠습니까? 관련 요청 데이터에 영향을 줄 수 있습니다.`, 
      type: 'danger', 
      onConfirm: () => handleDelete(id) 
    });
  };

  const handleDelete = async (id: number) => {
    setModal({ ...modal, isOpen: false });
    try {
      const res = await fetch(`${apiUrl}/api/admin/catalogs/${id}`, { method: 'DELETE', headers: headers() });
      if (res.ok) {
        setModal({ isOpen: true, title: '삭제 성공', message: '정상적으로 삭제되었습니다.', type: 'success', onConfirm: () => { setModal({ ...modal, isOpen: false }); fetchCatalogs(); } });
      }
    } catch (e) {
      setModal({ isOpen: true, title: '오류', message: '오류가 발생했습니다.', type: 'danger', onConfirm: () => setModal({ ...modal, isOpen: false }) });
    }
  };

  return (
    <div>
      <AdminModal {...modal} onCancel={() => setModal({ ...modal, isOpen: false })} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h3 style={{ color: '#fff', margin: 0 }}>서비스 카탈로그 관리 ({totalElements})</h3>
        <div style={{ display: 'flex', gap: '0.8rem', flex: 1, justifyContent: 'flex-end', minWidth: '300px' }}>
          <input 
            placeholder="카탈로그 이름, 카테고리 검색..." 
            value={search} 
            onChange={e => { setSearch(e.target.value); setPage(0); }} 
            style={{ padding: '0.7rem 1rem', borderRadius: '8px', border: '1px solid #444', backgroundColor: '#1e1e1e', color: '#fff', width: '250px' }} 
          />
          <button onClick={() => { setShowForm(!showForm); setEditingCatalog(null); }} style={{ padding: '0.7rem 1.5rem', borderRadius: '8px', border: 'none', backgroundColor: '#339af0', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>
            {showForm ? '✕ 취소' : '+ 항목 추가'}
          </button>
        </div>
      </div>

      {(showForm || editingCatalog) && (
        <form onSubmit={showForm ? handleCreate : handleUpdate} style={{ backgroundColor: '#1e1e1e', padding: '1.5rem', borderRadius: '8px', border: `1px solid ${editingCatalog ? '#339af0' : '#444'}`, marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', color: '#aaa', fontSize: '0.8rem', marginBottom: '0.3rem' }}>카탈로그 이름</label>
              <input required value={showForm ? catalogForm.catalogName : editingCatalog.catalogName} onChange={e => showForm ? setCatalogForm({...catalogForm, catalogName: e.target.value}) : setEditingCatalog({...editingCatalog, catalogName: e.target.value})} style={{ width: '100%', padding: '0.7rem', borderRadius: '6px', border: '1px solid #555', backgroundColor: '#2c2c2c', color: '#fff' }} />
            </div>
            <div>
              <label style={{ display: 'block', color: '#aaa', fontSize: '0.8rem', marginBottom: '0.3rem' }}>카테고리</label>
              <input required value={showForm ? catalogForm.category : editingCatalog.category} onChange={e => showForm ? setCatalogForm({...catalogForm, category: e.target.value}) : setEditingCatalog({...editingCatalog, category: e.target.value})} style={{ width: '100%', padding: '0.7rem', borderRadius: '6px', border: '1px solid #555', backgroundColor: '#2c2c2c', color: '#fff' }} />
            </div>
            <div>
              <label style={{ display: 'block', color: '#aaa', fontSize: '0.8rem', marginBottom: '0.3rem' }}>아이콘 (이모지)</label>
              <input value={showForm ? catalogForm.icon : editingCatalog.icon} onChange={e => showForm ? setCatalogForm({...catalogForm, icon: e.target.value}) : setEditingCatalog({...editingCatalog, icon: e.target.value})} style={{ width: '100%', padding: '0.7rem', borderRadius: '6px', border: '1px solid #555', backgroundColor: '#2c2c2c', color: '#fff' }} />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', color: '#aaa', fontSize: '0.8rem', marginBottom: '0.3rem' }}>설명</label>
            <textarea required value={showForm ? catalogForm.description : editingCatalog.description} onChange={e => showForm ? setCatalogForm({...catalogForm, description: e.target.value}) : setEditingCatalog({...editingCatalog, description: e.target.value})} rows={2} style={{ width: '100%', padding: '0.7rem', borderRadius: '6px', border: '1px solid #555', backgroundColor: '#2c2c2c', color: '#fff', fontFamily: 'inherit' }} />
          </div>
          <div>
            <label style={{ display: 'block', color: '#aaa', fontSize: '0.8rem', marginBottom: '0.3rem' }}>Form Schema (JSON Array)</label>
            <textarea value={showForm ? catalogForm.formSchema : editingCatalog.formSchema} onChange={e => showForm ? setCatalogForm({...catalogForm, formSchema: e.target.value}) : setEditingCatalog({...editingCatalog, formSchema: e.target.value})} rows={5} style={{ width: '100%', padding: '0.7rem', borderRadius: '6px', border: '1px solid #555', backgroundColor: '#2c2c2c', color: '#fcc419', fontFamily: 'monospace', fontSize: '0.85rem' }} />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
             <button type="submit" style={{ padding: '0.7rem 2rem', borderRadius: '6px', border: 'none', backgroundColor: editingCatalog ? '#339af0' : '#51cf66', color: editingCatalog ? '#fff' : '#000', fontWeight: 'bold', cursor: 'pointer' }}>
               {editingCatalog ? '수정 사항 저장' : '등록'}
             </button>
             <button type="button" onClick={() => { setShowForm(false); setEditingCatalog(null); }} style={{ padding: '0.7rem 2rem', borderRadius: '6px', border: '1px solid #444', backgroundColor: 'transparent', color: '#888', cursor: 'pointer' }}>취소</button>
          </div>
        </form>
      )}

      {loading ? (
        <div style={{ color: '#888', textAlign: 'center', padding: '2rem' }}>데이터 로딩...</div>
      ) : (
        <>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#2c2c2c', color: '#888', textAlign: 'left' }}>
                <th onClick={() => handleSort('id')} style={{ padding: '1rem', cursor: 'pointer' }}>ID {getSortIcon('id')}</th>
                <th onClick={() => handleSort('catalogName')} style={{ padding: '1rem', cursor: 'pointer' }}>항목명 {getSortIcon('catalogName')}</th>
                <th onClick={() => handleSort('category')} style={{ padding: '1rem', cursor: 'pointer' }}>카테고리 {getSortIcon('category')}</th>
                <th style={{ padding: '1rem' }}>공개 여부</th>
                <th style={{ padding: '1rem', textAlign: 'center' }}>작업</th>
              </tr>
            </thead>
            <tbody>
              {catalogs.map((c: any) => (
                <tr key={c.id} style={{ borderBottom: '1px solid #333' }}>
                  <td style={{ padding: '1rem', color: '#888' }}>{c.id}</td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                      <span style={{ fontSize: '1.2rem' }}>{c.icon || '📋'}</span>
                      <div style={{ color: '#fff', fontWeight: 'bold' }}>{c.catalogName}</div>
                    </div>
                  </td>
                  <td style={{ padding: '1rem', color: '#339af0' }}>{c.category}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ color: c.isPublished ? '#51cf66' : '#888' }}>{c.isPublished ? 'Published' : 'Draft'}</span>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                      <button onClick={() => { setEditingCatalog({...c}); setShowForm(false); }} style={{ padding: '0.4rem 0.8rem', backgroundColor: '#444', border: 'none', borderRadius: '4px', color: '#fff', cursor: 'pointer' }}>수정</button>
                      <button onClick={(e) => confirmDelete(e, c.id, c.catalogName)} style={{ padding: '0.4rem 0.8rem', backgroundColor: '#c92a2a', border: 'none', borderRadius: '4px', color: '#fff', cursor: 'pointer' }}>삭제</button>
                    </div>
                  </td>
                </tr>
              ))}
              {catalogs.length === 0 && (
                <tr><td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: '#666' }}>등록된 카탈로그가 없습니다.</td></tr>
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
