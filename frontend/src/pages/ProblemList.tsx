import { useState, useEffect } from 'react';

export default function ProblemList({ user }: { user: any }) {
  const [problems, setProblems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', priority: 'Medium', rootCause: '', workaround: '', status: 'OPEN' });
  const [submitting, setSubmitting] = useState(false);

  const fetchProblems = async () => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
    const token = localStorage.getItem('itsm_token');
    try {
      const res = await fetch(`${apiUrl}/api/problems`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) setProblems(await res.json());
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { fetchProblems(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
    const token = localStorage.getItem('itsm_token');
    try {
      const res = await fetch(`${apiUrl}/api/problems`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(form)
      });
      if (res.ok) { 
        setShowForm(false); 
        setForm({ title: '', description: '', priority: 'Medium', rootCause: '', workaround: '', status: 'OPEN' }); 
        fetchProblems(); 
      }
    } catch (e) { console.error(e); } finally { setSubmitting(false); }
  };

  if (loading) return <div style={{ color: '#fff' }}>Loading problems...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ color: '#fff', margin: 0 }}>Problem Management (RCA)</h3>
        {user.role !== 'ROLE_USER' && (
          <button onClick={() => setShowForm(!showForm)} style={{ padding: '0.7rem 1.5rem', borderRadius: '8px', border: 'none', backgroundColor: showForm ? '#555' : '#339af0', color: '#fff', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.9rem' }}>
            {showForm ? '✕ Cancel' : '+ Identify Problem'}
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ backgroundColor: '#1e1e1e', padding: '2rem', borderRadius: '8px', border: '1px solid #555', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <h4 style={{ color: '#339af0', margin: 0 }}>새 문제 등록 및 분석</h4>
          <input required placeholder="문제 제목 *" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid #555', backgroundColor: '#2c2c2c', color: '#fff', fontSize: '1rem' }} />
          <textarea placeholder="문제 설명" rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid #555', backgroundColor: '#2c2c2c', color: '#fff', fontSize: '1rem', fontFamily: 'inherit' }} />
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', color: '#888', marginBottom: '0.4rem', fontSize: '0.85rem' }}>Root Cause (근본 원인)</label>
              <textarea value={form.rootCause} onChange={e => setForm({ ...form, rootCause: e.target.value })} rows={3} style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid #555', backgroundColor: '#2c2c2c', color: '#fff', fontSize: '0.95rem' }} />
            </div>
            <div>
              <label style={{ display: 'block', color: '#888', marginBottom: '0.4rem', fontSize: '0.85rem' }}>Workaround (임시 해결책)</label>
              <textarea value={form.workaround} onChange={e => setForm({ ...form, workaround: e.target.value })} rows={3} style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid #555', backgroundColor: '#2c2c2c', color: '#fff', fontSize: '0.95rem' }} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })} style={{ flex: 1, padding: '0.8rem', borderRadius: '6px', border: '1px solid #555', backgroundColor: '#2c2c2c', color: '#fff' }}>
              <option>Critical</option><option>High</option><option>Medium</option><option>Low</option>
            </select>
            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} style={{ flex: 1, padding: '0.8rem', borderRadius: '6px', border: '1px solid #555', backgroundColor: '#2c2c2c', color: '#fff' }}>
              <option value="OPEN">Open</option>
              <option value="INVESTIGATING">Investigating</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          </div>
          <button type="submit" disabled={submitting} style={{ padding: '0.8rem', borderRadius: '6px', border: 'none', backgroundColor: '#339af0', color: '#fff', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}>
            {submitting ? 'Submitting...' : '✅ Save Problem Record'}
          </button>
        </form>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {problems.length === 0 ? (
          <div style={{ color: '#888', padding: '3rem', textAlign: 'center', backgroundColor: '#1e1e1e', borderRadius: '8px', border: '1px dashed #555' }}>
            No problem records found.
          </div>
        ) : problems.map(prob => (
          <div key={prob.id} style={{ backgroundColor: '#1e1e1e', padding: '1.5rem', borderRadius: '8px', border: '1px solid #333', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <span style={{ color: '#888', fontSize: '0.8rem' }}>PRB#{prob.id}</span>
                  <span style={{ backgroundColor: prob.priority === 'Critical' ? '#ff6b6b' : '#339af0', color: '#000', padding: '0.1rem 0.6rem', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 'bold' }}>{prob.priority}</span>
                  <h4 style={{ color: '#fff', margin: 0 }}>{prob.title}</h4>
                </div>
                <div style={{ color: '#aaa', fontSize: '0.9rem' }}>{prob.description}</div>
              </div>
              <div style={{ backgroundColor: prob.status === 'RESOLVED' ? '#51cf66' : '#fcc419', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.85rem', color: '#000', fontWeight: 'bold' }}>
                {prob.status}
              </div>
            </div>
            
            {(prob.rootCause || prob.workaround) && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #333' }}>
                <div>
                  <div style={{ color: '#339af0', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '0.3rem' }}>ROOT CAUSE</div>
                  <div style={{ color: '#eee', fontSize: '0.9rem' }}>{prob.rootCause || 'Under investigation...'}</div>
                </div>
                <div>
                  <div style={{ color: '#51cf66', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '0.3rem' }}>WORKAROUND</div>
                  <div style={{ color: '#eee', fontSize: '0.9rem' }}>{prob.workaround || 'None yet.'}</div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
