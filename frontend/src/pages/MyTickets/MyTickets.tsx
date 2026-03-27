import { useState, useEffect } from 'react';
import type { ServiceRequest, SRStatus } from '../ServiceRequest/types';
import { MyTicketDetail } from './components/MyTicketDetail';

const STATUS_MAP: Record<SRStatus, { label: string; color: string; bg: string }> = {
  OPEN: { label: '신규 접수', color: '#339af0', bg: 'rgba(51, 154, 240, 0.1)' },
  ASSIGNED: { label: '담당자 할당', color: '#fcc419', bg: 'rgba(252, 196, 25, 0.1)' },
  IN_PROGRESS: { label: '처리 중', color: '#ff922b', bg: 'rgba(255, 146, 43, 0.1)' },
  RESOLVED: { label: '조치 완료', color: '#51cf66', bg: 'rgba(81, 207, 102, 0.1)' },
  CLOSED: { label: '종료/승인', color: '#888888', bg: 'rgba(136, 136, 136, 0.1)' },
  CANCELED: { label: '취소됨', color: '#fa5252', bg: 'rgba(250, 82, 82, 0.1)' },
};

export default function MyTickets({ user }: { user: any }) {
  const [tickets, setTickets] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedTicket, setSelectedTicket] = useState<ServiceRequest | null>(null);

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
  const token = localStorage.getItem('itsm_token');

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/api/requests`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        // Sort by ID desc by default
        setTickets(data.sort((a: any, b: any) => b.id - a.id));
      }
    } catch (err) {
      console.error("Failed to load tickets:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [user.userId]);

  const handleCancel = async (id: number) => {
    if (!window.confirm("정말로 이 요청을 취소하시겠습니까?")) return;
    
    try {
      const response = await fetch(`${apiUrl}/api/requests/${id}/cancel`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        alert("요청이 취소되었습니다.");
        setSelectedTicket(null);
        fetchTickets();
      } else {
        const err = await response.json();
        alert(`취소 실패: ${err.message}`);
      }
    } catch (err) {
      console.error("Failed to cancel ticket:", err);
    }
  };

  const filteredTickets = tickets.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.id.toString().includes(searchTerm);
    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading && tickets.length === 0) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px', color: '#888' }}>
        <div style={{ fontSize: '1.2rem', fontWeight: 500 }}>불러오는 중...</div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', fontFamily: 'Inter, system-ui, sans-serif' }}>
      
      {/* Search and Filters */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1e1e1e', padding: '1.2rem 2rem', borderRadius: '12px', border: '1px solid #333', gap: '1.5rem' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: '500px' }}>
          <input 
            type="text" 
            placeholder="요청 제목 또는 ID로 검색..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid #444', backgroundColor: '#252525', color: '#fff', fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span style={{ color: '#888', fontSize: '0.9rem', fontWeight: 600 }}>상태 필터:</span>
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid #444', backgroundColor: '#252525', color: '#fff', cursor: 'pointer', outline: 'none' }}
          >
            <option value="ALL">전체 보기</option>
            {Object.entries(STATUS_MAP).map(([key, val]) => (
              <option key={key} value={key}>{val.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div style={{ color: '#888', fontSize: '0.9rem', fontWeight: 500 }}>
        총 <span style={{ color: '#fff', fontWeight: 700 }}>{filteredTickets.length}</span> 건의 요청이 있습니다.
      </div>

      {/* Premium Card Table Hybrid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filteredTickets.length === 0 ? (
          <div style={{ color: '#888', padding: '5rem', textAlign: 'center', backgroundColor: '#1e1e1e', borderRadius: '16px', border: '1px dashed #444', fontSize: '1.2rem' }}>
            {searchTerm || statusFilter !== 'ALL' ? "검색 결과가 없습니다." : "아직 서비스 요청 내역이 없습니다."}
          </div>
        ) : (
          filteredTickets.map(ticket => {
            const status = STATUS_MAP[ticket.status] || { label: ticket.status, color: '#fff', bg: '#333' };
            return (
              <div 
                key={ticket.id} 
                onClick={() => setSelectedTicket(ticket)}
                style={{ backgroundColor: '#1e1e1e', padding: '1.5rem 2.5rem', borderRadius: '12px', border: '1px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(0,0,0,0.2)', position: 'relative', overflow: 'hidden' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#444'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.4)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#333'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)'; }}
              >
                {/* Visual Accent */}
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '6px', backgroundColor: status.color }} />

                {/* Left Side: Basic Info */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ color: '#555', fontVariantNumeric: 'tabular-nums', fontWeight: 700, fontSize: '0.9rem' }}>#{ticket.id}</span>
                    <h3 style={{ color: '#fff', margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>{ticket.title}</h3>
                  </div>
                  <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <div style={{ color: '#888', fontSize: '0.85rem' }}>
                      Priority: <span style={{ color: '#ccc', fontWeight: 600 }}>{ticket.priority}</span>
                    </div>
                    <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#444' }} />
                    <div style={{ color: '#888', fontSize: '0.85rem' }}>
                      Category: <span style={{ color: '#ccc', fontWeight: 600 }}>{ticket.catalog?.category || 'General'}</span>
                    </div>
                    <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#444' }} />
                    <div style={{ color: '#888', fontSize: '0.85rem' }}>
                      Created: <span style={{ color: '#ccc', fontWeight: 600 }}>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {/* Right Side: Status and Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem' }}>
                    <div style={{ backgroundColor: status.bg, border: `1px solid ${status.color}44`, color: status.color, padding: '0.4rem 1.2rem', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 800, whiteSpace: 'nowrap' }}>
                      {status.label}
                    </div>
                    {ticket.assignee && (
                      <div style={{ color: '#666', fontSize: '0.75rem' }}>
                        Assigned to: <span style={{ color: '#888' }}>{ticket.assignee.userName}</span>
                      </div>
                    )}
                  </div>
                  
                  <div style={{ display: 'flex', gap: '0.8rem' }}>
                    {ticket.status === 'OPEN' && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleCancel(ticket.id); }}
                        style={{ padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid #fa5252', backgroundColor: 'transparent', color: '#fa5252', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s' }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(250, 82, 82, 0.1)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                      >
                        Cancel
                      </button>
                    )}
                    <div style={{ color: '#444' }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Detail Modal */}
      {selectedTicket && (
        <MyTicketDetail 
          ticket={selectedTicket} 
          onClose={() => setSelectedTicket(null)} 
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}
