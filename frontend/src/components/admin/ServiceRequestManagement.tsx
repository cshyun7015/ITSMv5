import { useState, useEffect, useCallback } from 'react';
import AdminModal from './AdminModal';

export default function ServiceRequestManagement({ apiUrl, headers, onSelectDetail }: any) {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [sort, setSort] = useState({ field: 'id', dir: 'desc' });

  const [modal, setModal] = useState({ isOpen: false, title: '', message: '', type: 'info' as any, onConfirm: () => {} });

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const url = `${apiUrl}/api/requests/admin/list?page=${page}&size=10&search=${encodeURIComponent(search)}&status=${statusFilter}&sort=${sort.field},${sort.dir}`;
      const res = await fetch(url, { headers: headers() });
      if (res.ok) {
        const data = await res.json();
        setRequests(data.content || []);
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements);
      }
    } catch (e) {
      console.error('Failed to fetch requests:', e);
    } finally {
      setLoading(false);
    }
  }, [apiUrl, headers, page, search, statusFilter, sort]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchRequests();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchRequests]);

  const handleSort = (field: string) => {
    const isSame = sort.field === field;
    setSort({ field, dir: isSame ? (sort.dir === 'asc' ? 'desc' : 'asc') : 'asc' });
    setPage(0);
  };

  const getSortIcon = (field: string) => {
    if (sort.field !== field) return '↕️';
    return sort.dir === 'asc' ? '🔼' : '🔽';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN': return '#339af0';
      case 'ASSIGNED': return '#fcc419';
      case 'IN_PROGRESS': return '#94d82d';
      case 'RESOLVED': return '#51cf66';
      case 'CLOSED': return '#888';
      case 'CANCELED': return '#fa5252';
      default: return '#eee';
    }
  };

  const handleDelete = async (id: number) => {
    setModal({ ...modal, isOpen: false });
    try {
      const res = await fetch(`${apiUrl}/api/requests/admin/${id}`, { method: 'DELETE', headers: headers() });
      if (res.ok) {
        setModal({ isOpen: true, title: '삭제 성공', message: '요청이 삭제되었습니다.', type: 'success', onConfirm: () => { setModal({ ...modal, isOpen: false }); fetchRequests(); } });
      }
    } catch (e) {
      setModal({ isOpen: true, title: '오류', message: '삭제 중 오류가 발생했습니다.', type: 'danger', onConfirm: () => setModal({ ...modal, isOpen: false }) });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <AdminModal {...modal} onCancel={() => setModal({ ...modal, isOpen: false })} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <h3 style={{ color: '#fff', margin: 0 }}>서비스 요청 관리 ({totalElements})</h3>
        <div style={{ display: 'flex', gap: '0.8rem', flex: 1, justifyContent: 'flex-end', minWidth: '300px' }}>
          <select 
            value={statusFilter} 
            onChange={e => { setStatusFilter(e.target.value); setPage(0); }}
            style={{ padding: '0.7rem', borderRadius: '8px', border: '1px solid #444', backgroundColor: '#1e1e1e', color: '#fff' }}
          >
            <option value="">모든 상태</option>
            <option value="OPEN">접수(Open)</option>
            <option value="ASSIGNED">할당됨(Assigned)</option>
            <option value="IN_PROGRESS">처리 중(In Progress)</option>
            <option value="RESOLVED">해결됨(Resolved)</option>
            <option value="CLOSED">종료(Closed)</option>
          </select>
          <input 
            placeholder="제목, 요청자 검색..." 
            value={search} 
            onChange={e => { setSearch(e.target.value); setPage(0); }} 
            style={{ padding: '0.7rem 1rem', borderRadius: '8px', border: '1px solid #444', backgroundColor: '#1e1e1e', color: '#fff', width: '250px' }} 
          />
          <button onClick={fetchRequests} style={{ padding: '0.7rem 1.5rem', borderRadius: '8px', border: 'none', backgroundColor: '#444', color: '#fff', cursor: 'pointer' }}>
            새로고침
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ color: '#888', textAlign: 'center', padding: '3rem' }}>요청 데이터 불러오는 중...</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #333', color: '#888', textAlign: 'left' }}>
                <th onClick={() => handleSort('id')} style={{ padding: '1rem', cursor: 'pointer' }}>ID {getSortIcon('id')}</th>
                <th onClick={() => handleSort('title')} style={{ padding: '1rem', cursor: 'pointer' }}>제목 {getSortIcon('title')}</th>
                <th style={{ padding: '1rem' }}>요청자</th>
                <th style={{ padding: '1rem' }}>카테고리</th>
                <th style={{ padding: '1rem' }}>상태</th>
                <th onClick={() => handleSort('createdAt')} style={{ padding: '1rem', cursor: 'pointer' }}>생성일 {getSortIcon('createdAt')}</th>
                <th style={{ padding: '1rem', textAlign: 'center' }}>작업</th>
              </tr>
            </thead>
            <tbody>
              {requests.map(req => (
                <tr key={req.id} style={{ borderBottom: '1px solid #222', transition: 'background-color 0.2s' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = '#252525'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <td style={{ padding: '1rem', color: '#666' }}>#{req.id}</td>
                  <td style={{ padding: '1rem', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => onSelectDetail(req.id)}>{req.title}</td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ color: '#aaa', fontSize: '0.9rem' }}>{req.requester?.userName || 'System'}</div>
                    <div style={{ color: '#555', fontSize: '0.8rem' }}>{req.tenant?.tenantName}</div>
                  </td>
                  <td style={{ padding: '1rem', color: '#339af0' }}>{req.catalog?.category}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      padding: '0.3rem 0.6rem', 
                      borderRadius: '4px', 
                      fontSize: '0.75rem', 
                      fontWeight: 'bold', 
                      backgroundColor: `${getStatusColor(req.status)}22`, 
                      color: getStatusColor(req.status),
                      border: `1px solid ${getStatusColor(req.status)}44`
                    }}>
                      {req.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', color: '#777', fontSize: '0.85rem' }}>{new Date(req.createdAt).toLocaleString()}</td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                      <button onClick={() => onSelectDetail(req.id)} style={{ padding: '0.4rem 0.8rem', backgroundColor: '#333', border: '1px solid #444', borderRadius: '4px', color: '#fff', cursor: 'pointer' }}>조회</button>
                      <button onClick={() => setModal({ isOpen: true, title: '삭제 확인', message: '이 요청을 삭제하시겠습니까?', type: 'danger', onConfirm: () => handleDelete(req.id) })} style={{ padding: '0.4rem 0.8rem', backgroundColor: '#c92a2a', border: 'none', borderRadius: '4px', color: '#fff', cursor: 'pointer' }}>삭제</button>
                    </div>
                  </td>
                </tr>
              ))}
              {requests.length === 0 && (
                <tr><td colSpan={7} style={{ padding: '4rem', textAlign: 'center', color: '#555' }}>표시할 기록이 없습니다.</td></tr>
              )}
            </tbody>
          </table>
          
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '2rem' }}>
              <button disabled={page === 0} onClick={() => setPage(page - 1)} style={{ padding: '0.5rem 1rem', borderRadius: '4px', border: '1px solid #444', backgroundColor: page === 0 ? '#222' : '#333', color: page === 0 ? '#555' : '#fff', cursor: page === 0 ? 'not-allowed' : 'pointer' }}>이전</button>
              <span style={{ color: '#fff' }}>Page {page + 1} of {totalPages}</span>
              <button disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)} style={{ padding: '0.5rem 1rem', borderRadius: '4px', border: '1px solid #444', backgroundColor: page >= totalPages - 1 ? '#222' : '#333', color: page >= totalPages - 1 ? '#555' : '#fff', cursor: page >= totalPages - 1 ? 'not-allowed' : 'pointer' }}>다음</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
