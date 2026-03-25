import { useState, useEffect } from 'react';
import FileUpload from '../components/FileUpload';

const STATUS_COLOR: Record<string, string> = {
  INC_OPEN: '#ff6b6b',
  INC_IN_PROGRESS: '#ff922b',
  INC_RESOLVED: '#51cf66',
  INC_CLOSED: '#888',
};
const STATUS_LABEL: Record<string, string> = {
  INC_OPEN: '🔴 신규 접수',
  INC_IN_PROGRESS: '🟠 처리 중',
  INC_RESOLVED: '🟢 조치 완료',
  INC_CLOSED: '⚫ 종료',
};
const PRIORITY_COLOR: Record<string, string> = {
  Critical: '#ff6b6b',
  High: '#ff922b',
  Medium: '#fcc419',
  Low: '#74c0fc',
};

export default function IncidentList({ user }: { user: any }) {
  const [incidents, setIncidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', priority: 'Medium', impact: 'Individual' });
  const [submitting, setSubmitting] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const fetchIncidents = async () => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
    const token = localStorage.getItem('itsm_token');
    try {
      const res = await fetch(`${apiUrl}/api/incidents?tenantId=${user.tenantId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) setIncidents(await res.json());
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { fetchIncidents(); }, [user.tenantId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
    const token = localStorage.getItem('itsm_token');
    try {
      const res = await fetch(`${apiUrl}/api/incidents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ ...form, reporterId: user.userId })
      });
      if (res.ok) { 
        const createdIncident = await res.json();
        
        // Upload attachments if any
        if (files.length > 0) {
          for (let file of files) {
            const fd = new FormData();
            fd.append('file', file);
            fd.append('relatedEntityType', 'INCIDENT');
            fd.append('relatedEntityId', String(createdIncident.id));
            await fetch(`${apiUrl}/api/attachments/upload`, {
              method: 'POST',
              headers: { 'Authorization': `Bearer ${token}` },
              body: fd
            });
          }
        }

        setShowForm(false); 
        setForm({ title: '', description: '', priority: 'Medium', impact: 'Individual' }); 
        setFiles([]);
        fetchIncidents(); 
      }
    } catch (e) { console.error(e); } finally { setSubmitting(false); }
  };

  if (loading) return <div style={{ color: '#fff' }}>Loading incidents...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ color: '#fff', margin: 0 }}>Active Incidents</h3>
        <button onClick={() => setShowForm(!showForm)} style={{ padding: '0.7rem 1.5rem', borderRadius: '8px', border: 'none', backgroundColor: showForm ? '#555' : '#ff6b6b', color: '#fff', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.9rem' }}>
          {showForm ? '✕ Cancel' : '+ Report Incident'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ backgroundColor: '#1e1e1e', padding: '2rem', borderRadius: '8px', border: '1px solid #555', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <h4 style={{ color: '#ff6b6b', margin: 0 }}>장애 신고</h4>
          <input required placeholder="장애 제목 *" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid #555', backgroundColor: '#2c2c2c', color: '#fff', fontSize: '1rem' }} />
          <textarea placeholder="장애 설명" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid #555', backgroundColor: '#2c2c2c', color: '#fff', fontSize: '1rem', fontFamily: 'inherit' }} />
          <div style={{ display: 'flex', gap: '1rem' }}>
            <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })} style={{ flex: 1, padding: '0.8rem', borderRadius: '6px', border: '1px solid #555', backgroundColor: '#2c2c2c', color: '#fff' }}>
              <option>Critical</option><option>High</option><option>Medium</option><option>Low</option>
            </select>
            <select value={form.impact} onChange={e => setForm({ ...form, impact: e.target.value })} style={{ flex: 1, padding: '0.8rem', borderRadius: '6px', border: '1px solid #555', backgroundColor: '#2c2c2c', color: '#fff' }}>
              <option>Service-wide</option><option>Department</option><option>Individual</option>
            </select>
          </div>
          <FileUpload files={files} onChange={setFiles} />
          <button type="submit" disabled={submitting} style={{ padding: '0.8rem', borderRadius: '6px', border: 'none', backgroundColor: '#ff6b6b', color: '#fff', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}>
            {submitting ? 'Submitting...' : '🚨 Submit Incident Report'}
          </button>
        </form>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {incidents.length === 0 ? (
          <div style={{ color: '#888', padding: '3rem', textAlign: 'center', backgroundColor: '#1e1e1e', borderRadius: '8px', border: '1px dashed #555' }}>
            No incidents reported. Click <strong>"+ Report Incident"</strong> to log one.
          </div>
        ) : incidents.map(inc => (
          <div key={inc.id} style={{ backgroundColor: '#1e1e1e', padding: '1.2rem 1.5rem', borderRadius: '8px', border: `1px solid ${inc.status === 'INC_OPEN' ? '#ff6b6b44' : '#333'}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
            <div>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.4rem' }}>
                <span style={{ color: '#888', fontSize: '0.8rem' }}>INC#{inc.id}</span>
                <span style={{ backgroundColor: PRIORITY_COLOR[inc.priority] || '#888', color: '#000', padding: '0.1rem 0.6rem', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 'bold' }}>{inc.priority}</span>
                <h4 style={{ color: '#fff', margin: 0 }}>{inc.title}</h4>
              </div>
              <div style={{ color: '#888', fontSize: '0.85rem' }}>Impact: <span style={{ color: '#ccc' }}>{inc.impact}</span> &nbsp;•&nbsp; {new Date(inc.createdAt).toLocaleString()}</div>
            </div>
            <div style={{ backgroundColor: STATUS_COLOR[inc.status] || '#888', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.85rem', color: '#000', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
              {STATUS_LABEL[inc.status] || inc.status}
            </div>
            
            {/* Attachment Preview (Simplified for MVP) */}
            <IncidentAttachments incidentId={inc.id} token={localStorage.getItem('itsm_token')!} />
          </div>
        ))}
      </div>
    </div>
  );
}
function IncidentAttachments({ incidentId, token }: { incidentId: number, token: string }) {
  const [attachments, setAttachments] = useState<any[]>([]);
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';

  useEffect(() => {
    fetch(`${apiUrl}/api/attachments/list?relatedEntityType=INCIDENT&relatedEntityId=${incidentId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => setAttachments(data))
    .catch(err => console.error(err));
  }, [incidentId]);

  if (attachments.length === 0) return null;

  return (
    <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      {attachments.map(at => (
        <a key={at.id} href={`${apiUrl}/api/attachments/download/${at.id}`} target="_blank" rel="noreferrer" style={{ fontSize: '0.75rem', color: '#339af0', textDecoration: 'none', backgroundColor: '#25262b', padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid #333' }}>
          📎 {at.originalName}
        </a>
      ))}
    </div>
  );
}
