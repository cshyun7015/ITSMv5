import React from 'react';
import { useServiceRequests } from '../hooks/useServiceRequests';
import { StatusBadge } from './StatusBadge';
import AdminModal from '../../../components/admin/AdminModal';

interface ServiceRequestListProps {
  onSelectDetail: (id: number) => void;
}

export const ServiceRequestList: React.FC<ServiceRequestListProps> = ({ onSelectDetail }) => {
  const {
    requests,
    loading,
    error,
    filters,
    pagination,
    updateFilters,
    handleSort,
    deleteRequest,
    refresh
  } = useServiceRequests();

  const [modal, setModal] = React.useState({ isOpen: false, title: '', message: '', type: 'info' as any, onConfirm: () => {} });

  const getSortIcon = (field: string) => {
    const [sortField, sortDir] = filters.sort.split(',');
    if (sortField !== field) return '↕️';
    return sortDir === 'asc' ? '🔼' : '🔽';
  };

  const handleDeleteClick = (id: number) => {
    setModal({
      isOpen: true,
      title: '삭제 확인',
      message: '이 요청을 삭제하시겠습니까?',
      type: 'danger',
      onConfirm: async () => {
        const success = await deleteRequest(id);
        if (success) {
          setModal({
            isOpen: true,
            title: '삭제 성공',
            message: '요청이 삭제되었습니다.',
            type: 'success',
            onConfirm: () => { setModal({ ...modal, isOpen: false }); refresh(); }
          });
        }
      }
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <AdminModal {...modal} onCancel={() => setModal({ ...modal, isOpen: false })} />

      {error && <div style={{ color: '#fa5252', padding: '1rem', backgroundColor: '#fa525211', borderRadius: '8px', border: '1px solid #fa525222' }}>{error}</div>}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <h3 style={{ color: '#fff', margin: 0 }}>서비스 요청 관리 ({pagination.totalElements})</h3>
        <div style={{ display: 'flex', gap: '0.8rem', flex: 1, justifyContent: 'flex-end', minWidth: '300px' }}>
          <select 
            value={filters.status} 
            onChange={e => updateFilters({ status: e.target.value })}
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
            value={filters.search} 
            onChange={e => updateFilters({ search: e.target.value })} 
            style={{ padding: '0.7rem 1rem', borderRadius: '8px', border: '1px solid #444', backgroundColor: '#1e1e1e', color: '#fff', width: '250px' }} 
          />
          <button onClick={refresh} style={{ padding: '0.7rem 1.5rem', borderRadius: '8px', border: 'none', backgroundColor: '#444', color: '#fff', cursor: 'pointer' }}>
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
                    <StatusBadge status={req.status} />
                  </td>
                  <td style={{ padding: '1rem', color: '#777', fontSize: '0.85rem' }}>{new Date(req.createdAt).toLocaleString()}</td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                      <button onClick={() => onSelectDetail(req.id)} style={{ padding: '0.4rem 0.8rem', backgroundColor: '#333', border: '1px solid #444', borderRadius: '4px', color: '#fff', cursor: 'pointer' }}>조회</button>
                      <button onClick={() => handleDeleteClick(req.id)} style={{ padding: '0.4rem 0.8rem', backgroundColor: '#c92a2a', border: 'none', borderRadius: '4px', color: '#fff', cursor: 'pointer' }}>삭제</button>
                    </div>
                  </td>
                </tr>
              ))}
              {requests.length === 0 && (
                <tr><td colSpan={7} style={{ padding: '4rem', textAlign: 'center', color: '#555' }}>표시할 기록이 없습니다.</td></tr>
              )}
            </tbody>
          </table>
          
          {pagination.totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '2rem' }}>
              <button disabled={filters.page === 0} onClick={() => updateFilters({ page: filters.page - 1 })} style={{ padding: '0.5rem 1rem', borderRadius: '4px', border: '1px solid #444', backgroundColor: filters.page === 0 ? '#222' : '#333', color: filters.page === 0 ? '#555' : '#fff', cursor: filters.page === 0 ? 'not-allowed' : 'pointer' }}>이전</button>
              <span style={{ color: '#fff' }}>Page {filters.page + 1} of {pagination.totalPages}</span>
              <button disabled={filters.page >= pagination.totalPages - 1} onClick={() => updateFilters({ page: filters.page + 1 })} style={{ padding: '0.5rem 1rem', borderRadius: '4px', border: '1px solid #444', backgroundColor: filters.page >= pagination.totalPages - 1 ? '#222' : '#333', color: filters.page >= pagination.totalPages - 1 ? '#555' : '#fff', cursor: filters.page >= pagination.totalPages - 1 ? 'not-allowed' : 'pointer' }}>다음</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
