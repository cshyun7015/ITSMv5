import { useState, useEffect } from 'react';

const STATUS_COLOR: Record<string, string> = {
  REQ_STATUS_OPEN: '#339af0',
  REQ_STATUS_ASSIGNED: '#fcc419',
  REQ_STATUS_IN_PROGRESS: '#ff922b',
  REQ_STATUS_RESOLVED: '#51cf66',
  REQ_STATUS_CLOSED: '#888',
};

const STATUS_LABEL: Record<string, string> = {
  REQ_STATUS_OPEN: '신규 접수',
  REQ_STATUS_ASSIGNED: '담당자 할당',
  REQ_STATUS_IN_PROGRESS: '처리 중',
  REQ_STATUS_RESOLVED: '조치 완료',
  REQ_STATUS_CLOSED: '종료/승인',
};

export default function MyTickets({ user }: { user: any }) {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      const token = localStorage.getItem('itsm_token');
      try {
        const response = await fetch(`${apiUrl}/api/requests?userId=${user.userId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) setTickets(await response.json());
      } catch (err) {
        console.error("Failed to load tickets:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, [user.userId]);

  if (loading) return <div style={{ color: '#fff' }}>Loading your tickets...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {tickets.length === 0 ? (
        <div style={{ color: '#888', padding: '3rem', textAlign: 'center', backgroundColor: '#1e1e1e', borderRadius: '8px', border: '1px dashed #555', fontSize: '1.1rem' }}>
          No service requests yet. Visit <strong>Service Catalog</strong> to submit one!
        </div>
      ) : (
        tickets.map(ticket => (
          <div key={ticket.id} style={{ backgroundColor: '#1e1e1e', padding: '1.5rem 2rem', borderRadius: '8px', border: '1px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ color: '#888', fontSize: '0.8rem' }}>#{ticket.id}</span>
                <h3 style={{ color: '#fff', margin: 0, fontSize: '1.1rem' }}>{ticket.title}</h3>
              </div>
              <div style={{ color: '#888', fontSize: '0.85rem' }}>
                Priority: <span style={{ color: '#fff' }}>{ticket.priority}</span>
                &nbsp;&nbsp;•&nbsp;&nbsp;
                Created: <span style={{ color: '#fff' }}>{new Date(ticket.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            <div style={{ backgroundColor: STATUS_COLOR[ticket.status] || '#888', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.85rem', color: '#000', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
              {STATUS_LABEL[ticket.status] || ticket.status}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
