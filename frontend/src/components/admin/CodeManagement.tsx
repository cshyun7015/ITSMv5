import { useState } from 'react';
import AdminModal from './AdminModal';

export default function CodeManagement({ codes, onFetch, apiUrl, headers }: any) {
  const [showForm, setShowForm] = useState(false);
  const [codeForm, setCodeForm] = useState({ codeId: '', groupCode: '', codeName: '', sortOrder: 1, isUse: true });
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '', type: 'info' as any, onConfirm: () => {} });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${apiUrl}/api/codes`, { method: 'POST', headers: headers(), body: JSON.stringify(codeForm) });
      if (res.ok) { 
        setModal({ isOpen: true, title: '성공', message: '코드가 저장되었습니다.', type: 'success', onConfirm: () => { setModal({ ...modal, isOpen: false }); setShowForm(false); onFetch(); } });
        setCodeForm({ codeId: '', groupCode: '', codeName: '', sortOrder: 1, isUse: true }); 
      }
    } catch (e) {
        setModal({ isOpen: true, title: '오류', message: '저장 중 오류가 발생했습니다.', type: 'danger', onConfirm: () => setModal({ ...modal, isOpen: false }) });
    }
  };

  const confirmDelete = (e: React.MouseEvent, codeId: string) => {
    e.stopPropagation();
    setModal({ 
      isOpen: true, 
      title: '삭제 확인', 
      message: '정말 이 코드를 삭제하시겠습니까?', 
      type: 'danger', 
      onConfirm: () => handleDelete(codeId) 
    });
  };

  const handleDelete = async (codeId: string) => {
    setModal({ ...modal, isOpen: false }); 
    try {
      const res = await fetch(`${apiUrl}/api/codes/${codeId}`, { method: 'DELETE', headers: headers() });
      if (res.ok) {
        setModal({ isOpen: true, title: '삭제 성공', message: '코드가 삭제되었습니다.', type: 'success', onConfirm: () => { setModal({ ...modal, isOpen: false }); onFetch(); } });
      }
    } catch (e) {
        setModal({ isOpen: true, title: '오류', message: '삭제 중 오류가 발생했습니다.', type: 'danger', onConfirm: () => setModal({ ...modal, isOpen: false }) });
    }
  };

  return (
    <div>
      <AdminModal {...modal} onCancel={() => setModal({ ...modal, isOpen: false })} />
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ color: '#fff', margin: 0 }}>시스템 공통 코드 ({codes.length})</h3>
        <button type="button" onClick={() => setShowForm(!showForm)} style={{ padding: '0.7rem 1.5rem', borderRadius: '8px', border: 'none', backgroundColor: '#339af0', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>
          {showForm ? '✕ 취소' : '+ 코드 추가'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSave} style={{ backgroundColor: '#1e1e1e', padding: '1.5rem', borderRadius: '8px', border: '1px solid #444', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <input required placeholder="코드 ID" value={codeForm.codeId} onChange={e => setCodeForm({...codeForm, codeId: e.target.value})} style={{ padding: '0.7rem', borderRadius: '6px', border: '1px solid #555', backgroundColor: '#2c2c2c', color: '#fff' }} />
          <input required placeholder="그룹 코드" value={codeForm.groupCode} onChange={e => setCodeForm({...codeForm, groupCode: e.target.value})} style={{ padding: '0.7rem', borderRadius: '6px', border: '1px solid #555', backgroundColor: '#2c2c2c', color: '#fff' }} />
          <input required placeholder="코드 명칭" value={codeForm.codeName} onChange={e => setCodeForm({...codeForm, codeName: e.target.value})} style={{ padding: '0.7rem', borderRadius: '6px', border: '1px solid #555', backgroundColor: '#2c2c2c', color: '#fff' }} />
          <input type="number" placeholder="순서" value={codeForm.sortOrder} onChange={e => setCodeForm({...codeForm, sortOrder: parseInt(e.target.value)})} style={{ padding: '0.7rem', width: '80px', borderRadius: '6px', border: '1px solid #555', backgroundColor: '#2c2c2c', color: '#fff' }} />
          <button type="submit" style={{ padding: '0.7rem 1.5rem', borderRadius: '6px', border: 'none', backgroundColor: '#51cf66', color: '#000', fontWeight: 'bold', cursor: 'pointer' }}>저장</button>
        </form>
      )}

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead><tr style={{ backgroundColor: '#2c2c2c', color: '#888' }}><th style={{ padding: '1rem' }}>그룹</th><th style={{ padding: '1rem' }}>코드 ID</th><th style={{ padding: '1rem' }}>명칭</th><th style={{ padding: '1rem' }}>순서</th><th style={{ padding: '1rem', textAlign: 'center' }}>작업</th></tr></thead>
        <tbody>
          {codes.sort((a: any,b: any) => a.groupCode.localeCompare(b.groupCode) || a.sortOrder - b.sortOrder).map((c: any) => (
            <tr key={c.codeId} style={{ borderBottom: '1px solid #333' }}>
              <td style={{ padding: '1rem', color: '#339af0' }}>{c.groupCode}</td>
              <td style={{ padding: '1rem', color: '#888' }}>{c.codeId}</td>
              <td style={{ padding: '1rem', color: '#fff', fontWeight: 'bold' }}>{c.codeName}</td>
              <td style={{ padding: '1rem', textAlign: 'center' }}>{c.sortOrder}</td>
              <td style={{ padding: '1rem', textAlign: 'center' }}>
                <button type="button" onClick={(e) => confirmDelete(e, c.codeId)} style={{ padding: '0.3rem 0.6rem', backgroundColor: '#ff6b6b', border: 'none', borderRadius: '4px', cursor: 'pointer', color: '#fff' }}>삭제</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
