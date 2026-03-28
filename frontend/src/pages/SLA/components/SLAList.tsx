import React, { useState } from 'react';
import { useSlas } from '../hooks/useSlas';
import type { Sla } from '../types';

interface SlaListProps {
  onSelectDetail: (id: number) => void;
}

const SlaList: React.FC<SlaListProps> = ({ onSelectDetail }) => {
  const { slas, loading, error, createSla } = useSlas();
  const [showCreate, setShowCreate] = useState(false);
  const [newSla, setNewSla] = useState<Partial<Sla>>({
    name: '',
    customerName: '',
    description: '',
    status: 'SLA_DRAFT',
    serviceHours: '24x7',
    metrics: []
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await createSla(newSla);
    if (res) setShowCreate(false);
  };

  if (loading && slas.length === 0) return <div style={{ color: '#aaa', textAlign: 'center', padding: '5rem' }}>Loading SLA agreements...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ color: '#fff', margin: 0, fontSize: '1.8rem', fontWeight: 700 }}>Service Level Agreements</h2>
          <p style={{ color: '#666', margin: '0.4rem 0 0 0', fontWeight: 500 }}>Define and manage your service quality targets and metrics.</p>
        </div>
        <button 
          onClick={() => setShowCreate(!showCreate)}
          style={{ padding: '0.8rem 1.5rem', backgroundColor: '#339af0', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          {showCreate ? 'CANCEL' : 'CREATE NEW SLA'}
        </button>
      </div>

      {showCreate && (
        <div style={{ backgroundColor: '#1a1a1a', padding: '2rem', borderRadius: '12px', border: '2px solid #339af0' }}>
          <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label htmlFor="sla-name" style={{ display: 'block', color: '#888', marginBottom: '0.5rem', fontSize: '0.85rem' }}>Agreement Name</label>
                <input 
                  id="sla-name"
                  required
                  placeholder="e.g., Enterprise Cloud Support SLA"
                  value={newSla.name}
                  onChange={e => setNewSla({...newSla, name: e.target.value})}
                  style={{ width: '100%', padding: '0.8rem', backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px', color: '#fff' }} 
                />
              </div>
              <div>
                <label htmlFor="customer-name" style={{ display: 'block', color: '#888', marginBottom: '0.5rem', fontSize: '0.85rem' }}>Customer / Client Name</label>
                <input 
                  id="customer-name"
                  required
                  placeholder="ACME Corp"
                  value={newSla.customerName}
                  onChange={e => setNewSla({...newSla, customerName: e.target.value})}
                  style={{ width: '100%', padding: '0.8rem', backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px', color: '#fff' }} 
                />
              </div>
            </div>
            <div>
              <label htmlFor="description" style={{ display: 'block', color: '#888', marginBottom: '0.5rem', fontSize: '0.85rem' }}>Description</label>
              <textarea 
                id="description"
                rows={3}
                placeholder="Details of the agreement scope and objectives..."
                value={newSla.description}
                onChange={e => setNewSla({...newSla, description: e.target.value})}
                style={{ width: '100%', padding: '0.8rem', backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px', color: '#fff' }} 
              />
            </div>
            <button type="submit" style={{ padding: '1rem', backgroundColor: '#339af0', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
              INITIATE AGREEMENT
            </button>
          </form>
        </div>
      )}

      {error && <div style={{ padding: '1rem', backgroundColor: '#fa525222', color: '#fa5252', borderRadius: '8px', border: '1px solid #fa525244' }}>{error}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '1.5rem' }}>
        {slas.map(sla => (
          <div 
            key={sla.id}
            onClick={() => sla.id && onSelectDetail(sla.id)}
            style={{ backgroundColor: '#1a1a1a', padding: '1.5rem', borderRadius: '12px', border: '1px solid #333', cursor: 'pointer', transition: 'transform 0.2s', borderLeft: `6px solid ${sla.status === 'SLA_ACTIVE' ? '#51cf66' : '#888'}` }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
               <span style={{ fontSize: '0.7rem', color: '#555', fontWeight: 800, textTransform: 'uppercase' }}>{sla.status}</span>
               <span style={{ fontSize: '0.7rem', color: '#888' }}>{sla.serviceHours}</span>
            </div>
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#fff' }}>{sla.name || sla.status || "Untitled SLA"}</h3>
            <div style={{ fontSize: '0.85rem', color: '#339af0', fontWeight: 600, marginBottom: '1rem' }}>{sla.customerName}</div>
            <p style={{ fontSize: '0.8rem', color: '#888', lineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden', margin: 0 }}>
              {sla.description || 'No description provided.'}
            </p>
            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.5rem' }}>
               {sla.metrics?.map((m, idx) => (
                  <span key={idx} style={{ padding: '0.2rem 0.5rem', backgroundColor: '#2c2c2c', borderRadius: '4px', fontSize: '0.65rem', color: '#aaa' }}>{m.name}</span>
               ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SlaList;
