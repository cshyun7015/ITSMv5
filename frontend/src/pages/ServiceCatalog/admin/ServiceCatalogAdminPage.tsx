import React, { useState, useEffect, useCallback } from 'react';
import { serviceCatalogApi } from '../api/serviceCatalogApi';
// @ts-ignore
import AdminModal from '../../../components/admin/AdminModal';
import type { ServiceCatalog } from '../types';

export const ServiceCatalogAdminPage: React.FC = () => {
  const [catalogs, setCatalogs] = useState<ServiceCatalog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  
  const [showForm, setShowForm] = useState(false);
  const [editingCatalog, setEditingCatalog] = useState<ServiceCatalog | null>(null);
  const [catalogForm, setCatalogForm] = useState({ 
    catalogName: '', 
    description: '', 
    category: '', 
    icon: '📋', 
    isPublished: true,
    ownerId: '',
    fulfillmentGroup: '',
    slaHours: 24,
    estimatedCost: 0,
    defaultUrgency: 'MEDIUM',
    fields: [] as any[]
  });

  const [newField, setNewField] = useState({ fieldName: '', fieldLabel: '', fieldType: 'TEXT', isRequired: false, fieldOrder: 0 });
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '', type: 'info' as any, onConfirm: () => {} });

  const fetchCatalogs = useCallback(async () => {
    setLoading(true);
    try {
      const data = await serviceCatalogApi.adminGetServiceCatalogs(search, page, 10);
      console.debug('[ADMIN UI] Fetched catalogs:', data.totalElements, 'total items');
      if (data.error && data.status === 403) {
        setModal({ isOpen: true, title: '접근 권한 없음', message: '관리자 권한이 없거나 세션이 만료되었습니다. 다시 로그인해 주세요.', type: 'danger', onConfirm: () => { window.location.href = '/'; } });
        return;
      }
      setCatalogs(data.content || []);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch (e: any) {
      console.error('Failed to fetch catalogs:', e);
      if (e.message?.includes('403')) {
         setModal({ isOpen: true, title: '접근 권한 없음', message: '관리자 권한이 없거나 세션이 만료되었습니다.', type: 'danger', onConfirm: () => { window.location.href = '/'; } });
      }
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCatalogs();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchCatalogs]);

  const addField = () => {
    if (!newField.fieldName || !newField.fieldLabel) return;
    const currentFields = showForm ? catalogForm.fields : editingCatalog!.fields;
    const updatedFields = [...currentFields, { ...newField, fieldOrder: currentFields.length + 1 }];
    if (showForm) {
      setCatalogForm({ ...catalogForm, fields: updatedFields });
    } else {
      setEditingCatalog({ ...editingCatalog!, fields: updatedFields });
    }
    setNewField({ fieldName: '', fieldLabel: '', fieldType: 'TEXT', isRequired: false, fieldOrder: 0 });
  };

  const removeField = (index: number) => {
    const currentFields = showForm ? catalogForm.fields : editingCatalog!.fields;
    const updatedFields = currentFields.filter((_: any, i: number) => i !== index);
    if (showForm) {
      setCatalogForm({ ...catalogForm, fields: updatedFields });
    } else {
      setEditingCatalog({ ...editingCatalog!, fields: updatedFields });
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await serviceCatalogApi.createServiceCatalog(catalogForm);
      setModal({ isOpen: true, title: '성공', message: '카탈로그 항목이 생성되었습니다.', type: 'success', onConfirm: () => { setModal({ ...modal, isOpen: false }); setShowForm(false); fetchCatalogs(); } });
      setCatalogForm({ catalogName: '', description: '', category: '', icon: '📋', isPublished: true, ownerId: '', fulfillmentGroup: '', slaHours: 24, estimatedCost: 0, defaultUrgency: 'MEDIUM', fields: [] });
    } catch (e: any) {
      if (e.message?.includes('403')) {
        setModal({ isOpen: true, title: '접근 권한 없음', message: '관리자 권한이 없습니다.', type: 'danger', onConfirm: () => setModal({ ...modal, isOpen: false }) });
      } else {
        setModal({ isOpen: true, title: '오류', message: '오류가 발생했습니다.', type: 'danger', onConfirm: () => setModal({ ...modal, isOpen: false }) });
      }
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCatalog) return;
    try {
      await serviceCatalogApi.updateServiceCatalog(editingCatalog.id, editingCatalog);
      setModal({ isOpen: true, title: '수정 완료', message: '정보가 성공적으로 반영되었습니다.', type: 'success', onConfirm: () => { setModal({ ...modal, isOpen: false }); setEditingCatalog(null); fetchCatalogs(); } });
    } catch (e: any) {
      if (e.message?.includes('403')) {
        setModal({ isOpen: true, title: '접근 권한 없음', message: '관리자 권한이 없습니다.', type: 'danger', onConfirm: () => setModal({ ...modal, isOpen: false }) });
      } else {
        setModal({ isOpen: true, title: '오류', message: '수정 중 오류가 발생했습니다.', type: 'danger', onConfirm: () => setModal({ ...modal, isOpen: false }) });
      }
    }
  };

  const confirmDelete = (e: React.MouseEvent, id: number, name: string) => {
    e.stopPropagation();
    setModal({ 
      isOpen: true, 
      title: '삭제 확인', 
      message: `정말 카탈로그(${name})를 삭제하시겠습니까?`, 
      type: 'danger', 
      onConfirm: () => handleDelete(id) 
    });
  };

  const handleDelete = async (id: number) => {
    setModal({ ...modal, isOpen: false });
    try {
      await serviceCatalogApi.deleteServiceCatalog(id);
      setModal({ isOpen: true, title: '삭제 성공', message: '정상적으로 삭제되었습니다.', type: 'success', onConfirm: () => { setModal({ ...modal, isOpen: false }); fetchCatalogs(); } });
    } catch (e) {
      setModal({ isOpen: true, title: '오류', message: '오류가 발생했습니다.', type: 'danger', onConfirm: () => setModal({ ...modal, isOpen: false }) });
    }
  };

  const renderFormField = (field: any, index: number) => (
    <div key={index} style={{ display: 'flex', gap: '1rem', alignItems: 'center', backgroundColor: '#252525', padding: '0.75rem', borderRadius: '8px', marginBottom: '0.5rem', border: '1px solid #333' }}>
      <div style={{ flex: 1, color: '#fff' }}>{field.fieldLabel} <span style={{color: '#666', fontSize: '0.8rem'}}>({field.fieldName})</span></div>
      <div style={{ width: '80px', color: '#339af0', fontSize: '0.8rem', fontWeight: 'bold' }}>{field.fieldType}</div>
      <div style={{ color: field.isRequired ? '#ff6b6b' : '#666', fontSize: '0.8rem' }}>{field.isRequired ? 'Required' : 'Optional'}</div>
      <button type="button" onClick={() => removeField(index)} style={{ padding: '0.3rem 0.6rem', backgroundColor: 'transparent', border: 'none', color: '#ff6b6b', cursor: 'pointer' }}>✕</button>
    </div>
  );

  return (
    <div style={{ padding: '1rem' }}>
      <AdminModal {...modal} onCancel={() => setModal({ ...modal, isOpen: false })} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ color: '#fff', margin: 0 }}>서비스 카탈로그 관리 ({totalElements})</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <input 
            placeholder="검색..." 
            value={search} 
            onChange={e => { setSearch(e.target.value); setPage(0); }} 
            style={{ padding: '0.8rem 1.2rem', borderRadius: '10px', border: '1px solid #444', backgroundColor: '#1e1e1e', color: '#fff', width: '300px' }} 
          />
          <button onClick={() => { setShowForm(!showForm); setEditingCatalog(null); }} style={{ padding: '0.8rem 1.5rem', borderRadius: '10px', border: 'none', backgroundColor: '#339af0', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>
            {showForm ? '✕ 취소' : '+ 항목 추가'}
          </button>
        </div>
      </div>

      {(showForm || editingCatalog) && (
        <form onSubmit={showForm ? handleCreate : handleUpdate} style={{ backgroundColor: '#1e1e1e', padding: '2rem', borderRadius: '12px', border: `1px solid ${editingCatalog ? '#339af0' : '#444'}`, marginBottom: '2rem' }}>
          <h3 style={{ color: '#fff', marginTop: 0, marginBottom: '2rem', borderBottom: '1px solid #333', paddingBottom: '1rem' }}>
            {showForm ? '새 서비스 카탈로그 등록' : '서비스 카탈로그 수정'}
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', color: '#aaa', fontSize: '0.85rem', marginBottom: '0.5rem' }}>카탈로그 이름</label>
              <input required value={showForm ? catalogForm.catalogName : editingCatalog!.catalogName} onChange={e => showForm ? setCatalogForm({...catalogForm, catalogName: e.target.value}) : setEditingCatalog({...editingCatalog!, catalogName: e.target.value})} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #444', backgroundColor: '#252525', color: '#fff' }} />
            </div>
            <div>
              <label style={{ display: 'block', color: '#aaa', fontSize: '0.85rem', marginBottom: '0.5rem' }}>카테고리</label>
              <input required value={showForm ? catalogForm.category : editingCatalog!.category} onChange={e => showForm ? setCatalogForm({...catalogForm, category: e.target.value}) : setEditingCatalog({...editingCatalog!, category: e.target.value})} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #444', backgroundColor: '#252525', color: '#fff' }} />
            </div>
            <div>
              <label style={{ display: 'block', color: '#aaa', fontSize: '0.85rem', marginBottom: '0.5rem' }}>아이콘 (이모지)</label>
              <input value={showForm ? catalogForm.icon : editingCatalog!.icon} onChange={e => showForm ? setCatalogForm({...catalogForm, icon: e.target.value}) : setEditingCatalog({...editingCatalog!, icon: e.target.value})} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #444', backgroundColor: '#252525', color: '#fff' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', color: '#aaa', fontSize: '0.85rem', marginBottom: '0.5rem' }}>SLA (시간)</label>
              <input type="number" value={showForm ? catalogForm.slaHours : editingCatalog!.slaHours} onChange={e => showForm ? setCatalogForm({...catalogForm, slaHours: parseInt(e.target.value)}) : setEditingCatalog({...editingCatalog!, slaHours: parseInt(e.target.value)})} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #444', backgroundColor: '#252525', color: '#fff' }} />
            </div>
            <div>
              <label style={{ display: 'block', color: '#aaa', fontSize: '0.85rem', marginBottom: '0.5rem' }}>추정 비용 ($)</label>
              <input type="number" value={showForm ? catalogForm.estimatedCost : editingCatalog!.estimatedCost} onChange={e => showForm ? setCatalogForm({...catalogForm, estimatedCost: parseFloat(e.target.value)}) : setEditingCatalog({...editingCatalog!, estimatedCost: parseFloat(e.target.value)})} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #444', backgroundColor: '#252525', color: '#fff' }} />
            </div>
            <div>
              <label style={{ display: 'block', color: '#aaa', fontSize: '0.85rem', marginBottom: '0.5rem' }}>기본 긴급도</label>
              <select value={showForm ? catalogForm.defaultUrgency : editingCatalog!.defaultUrgency} onChange={e => showForm ? setCatalogForm({...catalogForm, defaultUrgency: e.target.value}) : setEditingCatalog({...editingCatalog!, defaultUrgency: e.target.value})} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #444', backgroundColor: '#252525', color: '#fff' }}>
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
                <option value="CRITICAL">CRITICAL</option>
              </select>
            </div>
             <div>
              <label style={{ display: 'block', color: '#aaa', fontSize: '0.85rem', marginBottom: '0.5rem' }}>이행 그룹</label>
              <input value={showForm ? catalogForm.fulfillmentGroup : editingCatalog!.fulfillmentGroup} onChange={e => showForm ? setCatalogForm({...catalogForm, fulfillmentGroup: e.target.value}) : setEditingCatalog({...editingCatalog!, fulfillmentGroup: e.target.value})} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #444', backgroundColor: '#252525', color: '#fff' }} />
            </div>
          </div>

          <div style={{ marginBottom: '2.5rem' }}>
            <label style={{ display: 'block', color: '#aaa', fontSize: '0.85rem', marginBottom: '0.5rem' }}>설명</label>
            <textarea required value={showForm ? catalogForm.description : editingCatalog!.description} onChange={e => showForm ? setCatalogForm({...catalogForm, description: e.target.value}) : setEditingCatalog({...editingCatalog!, description: e.target.value})} rows={2} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #444', backgroundColor: '#252525', color: '#fff', fontFamily: 'inherit' }} />
          </div>

          <div style={{ marginBottom: '2rem', padding: '1.5rem', backgroundColor: '#181818', borderRadius: '12px', border: '1px dashed #333' }}>
            <h4 style={{ color: '#339af0', marginTop: 0, marginBottom: '1.5rem' }}>동적 필드 구성</h4>
            
            <div style={{ marginBottom: '1.5rem' }}>
              {(showForm ? catalogForm.fields : editingCatalog!.fields).map((f: any, i: number) => renderFormField(f, i))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 2fr 1fr auto', gap: '0.75rem', alignItems: 'flex-end', padding: '1rem', backgroundColor: '#252525', borderRadius: '8px' }}>
              <div>
                <label style={{ display: 'block', color: '#888', fontSize: '0.75rem', marginBottom: '0.3rem' }}>필드 명 (ID)</label>
                <input placeholder="fieldName" value={newField.fieldName} onChange={e => setNewField({...newField, fieldName: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #444', backgroundColor: '#1e1e1e', color: '#fff' }} />
              </div>
              <div>
                <label style={{ display: 'block', color: '#888', fontSize: '0.75rem', marginBottom: '0.3rem' }}>라벨 (표시용)</label>
                <input placeholder="Field Label" value={newField.fieldLabel} onChange={e => setNewField({...newField, fieldLabel: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #444', backgroundColor: '#1e1e1e', color: '#fff' }} />
              </div>
              <div>
                <label style={{ display: 'block', color: '#888', fontSize: '0.75rem', marginBottom: '0.3rem' }}>타입</label>
                <select value={newField.fieldType} onChange={e => setNewField({...newField, fieldType: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #444', backgroundColor: '#1e1e1e', color: '#fff' }}>
                  <option value="TEXT">TEXT</option>
                  <option value="NUMBER">NUMBER</option>
                  <option value="SELECT">SELECT</option>
                  <option value="CHECKBOX">CHECKBOX</option>
                  <option value="DATE">DATE</option>
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '0.3rem' }}>
                <label style={{ color: '#888', fontSize: '0.75rem', marginBottom: '0.3rem' }}>필수</label>
                <input type="checkbox" checked={newField.isRequired} onChange={e => setNewField({...newField, isRequired: e.target.checked})} style={{ width: '1.2rem', height: '1.2rem' }} />
              </div>
              <button type="button" onClick={addField} style={{ padding: '0.6rem 1.2rem', borderRadius: '6px', border: 'none', backgroundColor: '#339af0', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>추가</button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', borderTop: '1px solid #333', paddingTop: '1.5rem' }}>
             <button type="submit" style={{ padding: '1rem 3rem', borderRadius: '8px', border: 'none', backgroundColor: editingCatalog ? '#339af0' : '#51cf66', color: editingCatalog ? '#fff' : '#000', fontWeight: 'bold', cursor: 'pointer', fontSize: '1.05rem', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
               {editingCatalog ? '수정 사항 저장' : '새 카탈로그 등록'}
             </button>
             <button type="button" onClick={() => { setShowForm(false); setEditingCatalog(null); }} style={{ padding: '1rem 2.5rem', borderRadius: '8px', border: '1px solid #444', backgroundColor: 'transparent', color: '#888', cursor: 'pointer', fontWeight: 500 }}>취소</button>
          </div>
        </form>
      )}

      {loading ? (
        <div style={{ color: '#888', textAlign: 'center', padding: '3rem' }}>로딩 중...</div>
      ) : (
        <>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#1e1e1e', borderRadius: '12px', overflow: 'hidden' }}>
              <thead>
                <tr style={{ backgroundColor: '#2c2c2c', color: '#888', textAlign: 'left' }}>
                  <th style={{ padding: '1.2rem 1.5rem' }}>ID</th>
                  <th style={{ padding: '1.2rem 1.5rem' }}>카탈로그 명</th>
                  <th style={{ padding: '1.2rem 1.5rem' }}>카테고리</th>
                  <th style={{ padding: '1.2rem 1.5rem' }}>상태</th>
                  <th style={{ padding: '1.2rem 1.5rem', textAlign: 'center' }}>관리</th>
                </tr>
              </thead>
              <tbody>
                {catalogs.map((c: ServiceCatalog) => (
                  <tr key={c.id} style={{ borderBottom: '1px solid #333' }}>
                    <td style={{ padding: '1.2rem 1.5rem', color: '#888' }}>{c.id}</td>
                    <td style={{ padding: '1.2rem 1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ fontSize: '1.5rem' }}>{c.icon || '📋'}</span>
                        <div style={{ color: '#fff', fontWeight: 600 }}>{c.catalogName}</div>
                      </div>
                    </td>
                    <td style={{ padding: '1.2rem 1.5rem' }}>
                      <span style={{ color: '#339af0', backgroundColor: 'rgba(51,154,240,0.1)', padding: '4px 10px', borderRadius: '20px', fontSize: '0.85rem' }}>{c.category}</span>
                    </td>
                    <td style={{ padding: '1.2rem 1.5rem' }}>
                      <span style={{ color: c.isPublished ? '#51cf66' : '#888', fontSize: '0.9rem' }}>{c.isPublished ? '● Published' : '○ Draft'}</span>
                    </td>
                    <td style={{ padding: '1.2rem 1.5rem', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                        <button onClick={() => { setEditingCatalog({...c}); setShowForm(false); }} style={{ padding: '0.5rem 1rem', backgroundColor: '#333', border: '1px solid #444', borderRadius: '6px', color: '#fff', cursor: 'pointer' }}>수정</button>
                        <button onClick={(e) => confirmDelete(e, c.id, c.catalogName)} style={{ padding: '0.5rem 1rem', backgroundColor: 'rgba(201, 42, 42, 0.1)', border: '1px solid #c92a2a', borderRadius: '6px', color: '#c92a2a', cursor: 'pointer' }}>삭제</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {catalogs.length === 0 && (
                  <tr><td colSpan={5} style={{ padding: '5rem', textAlign: 'center', color: '#666' }}>검색 결과가 없습니다.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1.5rem', marginTop: '2.5rem' }}>
              <button disabled={page === 0} onClick={() => setPage(page - 1)} style={{ padding: '0.7rem 1.2rem', borderRadius: '8px', border: '1px solid #444', backgroundColor: page === 0 ? '#222' : '#333', color: page === 0 ? '#555' : '#fff', cursor: page === 0 ? 'not-allowed' : 'pointer' }}>이전</button>
              <div style={{ color: '#888' }}><span style={{ color: '#fff', fontWeight: 'bold' }}>{page + 1}</span> / {totalPages}</div>
              <button disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)} style={{ padding: '0.7rem 1.2rem', borderRadius: '8px', border: '1px solid #444', backgroundColor: page >= totalPages - 1 ? '#222' : '#333', color: page >= totalPages - 1 ? '#555' : '#fff', cursor: page >= totalPages - 1 ? 'not-allowed' : 'pointer' }}>다음</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
