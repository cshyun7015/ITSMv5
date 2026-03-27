import React, { useState, useEffect } from 'react';
import type { ServiceRequest, SRStatus } from '../../ServiceRequest/types';

interface MyTicketAttachmentsProps {
  requestId: number;
}

const MyTicketAttachments: React.FC<MyTicketAttachmentsProps> = ({ requestId }) => {
  const [attachments, setAttachments] = useState<any[]>([]);
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
  const token = localStorage.getItem('itsm_token');

  useEffect(() => {
    fetch(`${apiUrl}/api/attachments/list?relatedEntityType=SERVICE_REQUEST&relatedEntityId=${requestId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => setAttachments(data))
    .catch(err => console.error(err));
  }, [requestId]);

  if (attachments.length === 0) return null;

  return (
    <section>
      <h3 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '1rem', borderLeft: '4px solid #fcc419', paddingLeft: '1rem' }}>Attachments</h3>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        {attachments.map(at => (
          <a 
            key={at.id} 
            href={`${apiUrl}/api/attachments/download/${at.id}`} 
            target="_blank" 
            rel="noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#252525', padding: '0.8rem 1.2rem', borderRadius: '8px', border: '1px solid #333', color: '#ccc', textDecoration: 'none', transition: 'all 0.2s' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#444'; e.currentTarget.style.backgroundColor = '#2c2c2c'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#333'; e.currentTarget.style.backgroundColor = '#252525'; }}
          >
            <span>📎</span>
            <span style={{ fontSize: '0.9rem' }}>{at.originalName}</span>
          </a>
        ))}
      </div>
    </section>
  );
};

interface MyTicketDetailProps {
  ticket: ServiceRequest;
  onClose: () => void;
  onCancel?: (id: number) => void;
}

const STATUS_MAP: Record<SRStatus, { label: string; color: string; bg: string }> = {
  OPEN: { label: '신규 접수', color: '#339af0', bg: 'rgba(51, 154, 240, 0.1)' },
  ASSIGNED: { label: '담당자 할당', color: '#fcc419', bg: 'rgba(252, 196, 25, 0.1)' },
  IN_PROGRESS: { label: '처리 중', color: '#ff922b', bg: 'rgba(255, 146, 43, 0.1)' },
  RESOLVED: { label: '조치 완료', color: '#51cf66', bg: 'rgba(81, 207, 102, 0.1)' },
  CLOSED: { label: '종료/승인', color: '#888888', bg: 'rgba(136, 136, 136, 0.1)' },
  CANCELED: { label: '취소됨', color: '#fa5252', bg: 'rgba(250, 82, 82, 0.1)' },
};

export const MyTicketDetail: React.FC<MyTicketDetailProps> = ({ ticket, onClose, onCancel }) => {
  const statusInfo = STATUS_MAP[ticket.status] || { label: ticket.status, color: '#fff', bg: '#333' };
  
  let parsedFormData: Record<string, any> = {};
  try {
    parsedFormData = JSON.parse(ticket.formData || '{}');
  } catch (e) {
    console.error("Failed to parse form data", e);
  }

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '2rem', backdropFilter: 'blur(4px)' }}>
      <div style={{ backgroundColor: '#1e1e1e', width: '100%', maxWidth: '800px', maxHeight: '90vh', borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column', border: '1px solid #333', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
        
        {/* Header */}
        <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(to right, #252525, #1e1e1e)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
              <span style={{ color: '#888', fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>#{ticket.id}</span>
              <div style={{ backgroundColor: statusInfo.bg, color: statusInfo.color, padding: '0.2rem 0.8rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700, border: `1px solid ${statusInfo.color}44` }}>
                {statusInfo.label}
              </div>
            </div>
            <h2 style={{ margin: 0, color: '#fff', fontSize: '1.5rem', fontWeight: 700 }}>{ticket.title}</h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#888', fontSize: '2rem', cursor: 'pointer', padding: '0.5rem', lineHeight: 1 }}>&times;</button>
        </div>

        {/* Content */}
        <div style={{ padding: '2rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Metadata Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', backgroundColor: '#252525', padding: '1.5rem', borderRadius: '12px' }}>
            <div>
              <div style={{ color: '#666', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.4rem' }}>Category</div>
              <div style={{ color: '#ccc', fontSize: '0.95rem' }}>{ticket.catalog?.category || 'General'}</div>
            </div>
            <div>
              <div style={{ color: '#666', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.4rem' }}>Priority</div>
              <div style={{ color: '#ccc', fontSize: '0.95rem' }}>{ticket.priority}</div>
            </div>
            <div>
              <div style={{ color: '#666', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.4rem' }}>Created At</div>
              <div style={{ color: '#ccc', fontSize: '0.95rem' }}>{new Date(ticket.createdAt).toLocaleString()}</div>
            </div>
            <div>
              <div style={{ color: '#666', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.4rem' }}>Assignee</div>
              <div style={{ color: '#ccc', fontSize: '0.95rem' }}>{ticket.assignee?.userName || 'Unassigned'}</div>
            </div>
          </div>

          {/* Description */}
          <section>
            <h3 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '1rem', borderLeft: '4px solid #339af0', paddingLeft: '1rem' }}>Description</h3>
            <div style={{ color: '#aaa', lineHeight: '1.6', fontSize: '1rem', backgroundColor: '#252525', padding: '1.5rem', borderRadius: '12px', whiteSpace: 'pre-wrap' }}>
              {ticket.description || 'No description provided.'}
            </div>
          </section>

          {/* Form Data */}
          {Object.keys(parsedFormData).length > 0 && (
            <section>
              <h3 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '1rem', borderLeft: '4px solid #51cf66', paddingLeft: '1rem' }}>Submitted Information</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {Object.entries(parsedFormData).map(([key, value]) => (
                  <div key={key} style={{ backgroundColor: '#252525', padding: '1rem', borderRadius: '8px', border: '1px solid #333' }}>
                    <div style={{ color: '#666', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.2rem' }}>{key}</div>
                    <div style={{ color: '#eee', fontSize: '0.9rem' }}>{String(value)}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Resolution */}
          {ticket.resolution && (
            <section style={{ backgroundColor: 'rgba(81, 207, 102, 0.05)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(81, 207, 102, 0.2)' }}>
              <h3 style={{ color: '#51cf66', fontSize: '1.1rem', marginBottom: '1rem' }}>Resolution Context</h3>
              <div style={{ color: '#ccc', lineHeight: '1.6', fontSize: '1rem' }}>
                {ticket.resolution}
              </div>
            </section>
          )}

          {/* Attachments */}
          <MyTicketAttachments requestId={ticket.id} />
        </div>

        {/* Footer */}
        <div style={{ padding: '1.5rem 2rem', borderTop: '1px solid #333', display: 'flex', justifyContent: 'flex-end', gap: '1rem', backgroundColor: '#1a1a1a' }}>
          {ticket.status === 'OPEN' && onCancel && (
            <button 
              onClick={() => onCancel(ticket.id)}
              style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', border: '1px solid #fa5252', backgroundColor: 'transparent', color: '#fa5252', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
            >
              Cancel Request
            </button>
          )}
          <button 
            onClick={onClose}
            style={{ padding: '0.75rem 2rem', borderRadius: '8px', border: 'none', backgroundColor: '#333', color: '#fff', fontWeight: 600, cursor: 'pointer' }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
