import { useState, useEffect } from 'react';

const STATUS_COLOR: Record<string, string> = {
  CHG_DRAFT: '#74c0fc',
  CHG_REVIEW: '#fcc419',
  CHG_APPROVED: '#51cf66',
  CHG_IN_PROGRESS: '#ff922b',
  CHG_COMPLETED: '#339af0',
  CHG_FAILED: '#ff6b6b',
};
const STATUS_LABEL: Record<string, string> = {
  CHG_DRAFT: '초안',
  CHG_REVIEW: '검토 중',
  CHG_APPROVED: '승인됨',
  CHG_IN_PROGRESS: '진행 중',
  CHG_COMPLETED: '완료',
  CHG_FAILED: '실패',
};

export default function ChangeList({ user }: { user: any }) {
  const [changes, setChanges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', rollbackPlan: '', changeType: 'Normal', risk: 'Medium' });
  const [submitting, setSubmitting] = useState(false);

  const fetchChanges = async () => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
    const token = localStorage.getItem('itsm_token');
    try {
      const res = await fetch(`${apiUrl}/api/changes?tenantId=${user.tenantId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) setChanges(await res.json());
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { fetchChanges(); }, [user.tenantId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
    const token = localStorage.getItem('itsm_token');
    try {
      const res = await fetch(`${apiUrl}/api/changes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ ...form, requesterId: user.userId })
      });
      if (res.ok) { setShowForm(false); setForm({ title: '', description: '', rollbackPlan: '', changeType: 'Normal', risk: 'Medium' }); fetchChanges(); }
    } catch (e) { console.error(e); } finally { setSubmitting(false); }
  };

  if (loading) return <div style={{ color: '#fff' }}>Loading change requests...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ color: '#fff', margin: 0 }}>Change Requests (RFC)</h3>
        <button onClick={() => setShowForm(!showForm)} style={{ padding: '0.7rem 1.5rem', borderRadius: '8px', border: 'none', backgroundColor: showForm ? '#555' : '#339af0', color: '#fff', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.9rem' }}>
          {showForm ? '✕ Cancel' : '+ New RFC'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ backgroundColor: '#1e1e1e', padding: '2rem', borderRadius: '8px', border: '1px solid #444', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <h4 style={{ color: '#339af0', margin: 0 }}>변경 요청서 (RFC)</h4>
          <input required placeholder="변경 제목 *" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid #555', backgroundColor: '#2c2c2c', color: '#fff', fontSize: '1rem' }} />
          <textarea placeholder="변경 설명 및 이유" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid #555', backgroundColor: '#2c2c2c', color: '#fff', fontSize: '1rem', fontFamily: 'inherit' }} />
          <textarea placeholder="롤백 계획 (Rollback Plan)" rows={2} value={form.rollbackPlan} onChange={e => setForm({ ...form, rollbackPlan: e.target.value })} style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid #555', backgroundColor: '#2c2c2c', color: '#fff', fontSize: '1rem', fontFamily: 'inherit' }} />
          <div style={{ display: 'flex', gap: '1rem' }}>
            <select value={form.changeType} onChange={e => setForm({ ...form, changeType: e.target.value })} style={{ flex: 1, padding: '0.8rem', borderRadius: '6px', border: '1px solid #555', backgroundColor: '#2c2c2c', color: '#fff' }}>
              <option>Standard</option><option>Normal</option><option>Emergency</option>
            </select>
            <select value={form.risk} onChange={e => setForm({ ...form, risk: e.target.value })} style={{ flex: 1, padding: '0.8rem', borderRadius: '6px', border: '1px solid #555', backgroundColor: '#2c2c2c', color: '#fff' }}>
              <option>Low</option><option>Medium</option><option>High</option>
            </select>
          </div>
          <button type="submit" disabled={submitting} style={{ padding: '0.8rem', borderRadius: '6px', border: 'none', backgroundColor: '#339af0', color: '#fff', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}>
            {submitting ? 'Submitting...' : '📋 Submit RFC'}
          </button>
        </form>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {changes.length === 0 ? (
          <div style={{ color: '#888', padding: '3rem', textAlign: 'center', backgroundColor: '#1e1e1e', borderRadius: '8px', border: '1px dashed #555' }}>
            No change requests. Click <strong>"+ New RFC"</strong> to create one.
          </div>
        ) : changes.map(chg => (
          <div key={chg.id} style={{ backgroundColor: '#1e1e1e', padding: '1.2rem 1.5rem', borderRadius: '8px', border: '1px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
            <div>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.4rem' }}>
                <span style={{ color: '#888', fontSize: '0.8rem' }}>CHG#{chg.id}</span>
                <span style={{ backgroundColor: '#333', color: '#ccc', padding: '0.1rem 0.6rem', borderRadius: '10px', fontSize: '0.75rem' }}>{chg.changeType}</span>
                <span style={{ backgroundColor: chg.risk === 'High' ? '#ff6b6b33' : '#33333300', color: chg.risk === 'High' ? '#ff6b6b' : '#fcc419', padding: '0.1rem 0.6rem', borderRadius: '10px', fontSize: '0.75rem', border: '1px solid', borderColor: chg.risk === 'High' ? '#ff6b6b' : '#fcc419' }}>Risk: {chg.risk}</span>
                <h4 style={{ color: '#fff', margin: 0 }}>{chg.title}</h4>
              </div>
              <div style={{ color: '#888', fontSize: '0.85rem' }}>Created: <span style={{ color: '#ccc' }}>{new Date(chg.createdAt).toLocaleDateString()}</span></div>
            </div>
            <div style={{ backgroundColor: STATUS_COLOR[chg.status] || '#888', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.85rem', color: '#000', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
              {STATUS_LABEL[chg.status] || chg.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
