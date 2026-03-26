import { useState, useEffect } from 'react';
import ServiceDependencyMapper from './ServiceDependencyMapper';

export default function ServiceList({ user }: { user: any }) {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', criticality: 'MEDIUM', status: 'OPERATIONAL' });
  const [submitting, setSubmitting] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);

  if (selectedServiceId) {
    return <ServiceDependencyMapper serviceId={selectedServiceId} onBack={() => setSelectedServiceId(null)} />;
  }

  const fetchServices = async () => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
    const token = localStorage.getItem('itsm_token');
    try {
      const res = await fetch(`${apiUrl}/api/services`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) setServices(await res.json());
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { fetchServices(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
    const token = localStorage.getItem('itsm_token');
    try {
      const res = await fetch(`${apiUrl}/api/services`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(form)
      });
      if (res.ok) { setShowForm(false); setForm({ name: '', description: '', criticality: 'MEDIUM', status: 'OPERATIONAL' }); fetchServices(); }
    } catch (e) { console.error(e); } finally { setSubmitting(false); }
  };

  if (loading) return <div style={{ color: '#fff' }}>Loading service portfolio...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ color: '#fff', margin: 0 }}>IT Service Portfolio</h3>
        <button onClick={() => setShowForm(!showForm)} style={{ padding: '0.6rem 1.2rem', borderRadius: '8px', border: 'none', backgroundColor: '#339af0', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>
          {showForm ? 'Cancel' : '+ Define Service'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ backgroundColor: '#1e1e1e', padding: '1.5rem', borderRadius: '8px', border: '1px solid #444', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input required placeholder="Service Name (e.g. ERP, Corporate Email)" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid #555', backgroundColor: '#2c2c2c', color: '#fff' }} />
          <textarea placeholder="Service Description" rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid #555', backgroundColor: '#2c2c2c', color: '#fff', fontFamily: 'inherit' }} />
          <div style={{ display: 'flex', gap: '1rem' }}>
            <select value={form.criticality} onChange={e => setForm({ ...form, criticality: e.target.value })} style={{ flex: 1, padding: '0.8rem', borderRadius: '6px', border: '1px solid #555', backgroundColor: '#2c2c2c', color: '#fff' }}>
              <option value="LOW">Low Criticality</option>
              <option value="MEDIUM">Medium Criticality</option>
              <option value="HIGH">High Criticality</option>
              <option value="CRITICAL">Mission Critical</option>
            </select>
            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} style={{ flex: 1, padding: '0.8rem', borderRadius: '6px', border: '1px solid #555', backgroundColor: '#2c2c2c', color: '#fff' }}>
              <option value="PROPOSED">Proposed</option>
              <option value="DEFINED">Defined</option>
              <option value="OPERATIONAL">Operational</option>
              <option value="RETIRED">Retired</option>
            </select>
          </div>
          <button type="submit" disabled={submitting} style={{ padding: '0.8rem', borderRadius: '6px', border: 'none', backgroundColor: '#339af0', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>
            {submitting ? 'Creating...' : 'Register IT Service'}
          </button>
        </form>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {services.map(svc => (
          <div key={svc.id} style={{ backgroundColor: '#1e1e1e', padding: '1.5rem', borderRadius: '12px', border: '1px solid #333', display: 'flex', flexDirection: 'column', gap: '0.75rem', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <h4 style={{ color: '#fff', margin: 0 }}>{svc.name}</h4>
              <span style={{ fontSize: '0.7rem', color: '#339af0', border: '1px solid #339af0', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>{svc.status}</span>
            </div>
            <p style={{ color: '#aaa', fontSize: '0.85rem', margin: 0, minHeight: '40px' }}>{svc.description}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', color: svc.criticality === 'CRITICAL' ? '#ff6b6b' : '#fcc419' }}>Criticality: {svc.criticality}</span>
              <button 
                onClick={() => setSelectedServiceId(svc.id)}
                style={{ background: 'none', border: 'none', color: '#339af0', cursor: 'pointer', fontSize: '0.85rem', textDecoration: 'underline' }}
              >
                Manage Dependencies
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
