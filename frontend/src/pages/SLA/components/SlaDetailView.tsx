import React, { useState, useEffect } from 'react';
import { useSlaDetail } from '../hooks/useSlas';
import type { Sla, SlaMetric, SlaStatus } from '../types';
import AdminModal from '../../../components/admin/AdminModal';

interface SlaDetailViewProps {
  slaId: number;
  onBack: () => void;
  onDeleted: () => void;
}

const SlaDetailView: React.FC<SlaDetailViewProps> = ({ slaId, onBack, onDeleted }) => {
  const { sla, loading, updateSla, deleteSla } = useSlaDetail(slaId);
  const [formData, setFormData] = useState<Partial<Sla>>({});
  const [showMetricForm, setShowMetricForm] = useState(false);
  const [newMetric, setNewMetric] = useState<SlaMetric>({
    name: '', targetValue: 0, unit: '%', warningThreshold: 0, criticalThreshold: 0, frequency: 'Real-time', isActive: true
  });
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '', type: 'info' as any, onConfirm: () => {} });

  useEffect(() => {
    if (sla) setFormData({ ...sla });
  }, [sla]);

  const handleUpdate = async () => {
    const res = await updateSla(formData);
    if (res) setModal({ isOpen: true, title: '저장 완료', message: 'SLA 정보가 성공적으로 업데이트되었습니다.', type: 'success', onConfirm: () => setModal({ ...modal, isOpen: false }) });
  };

  const handleAddMetric = () => {
    const currentMetrics = formData.metrics || [];
    setFormData({ ...formData, metrics: [...currentMetrics, newMetric] });
    setShowMetricForm(false);
    setNewMetric({ name: '', targetValue: 0, unit: '%', warningThreshold: 0, criticalThreshold: 0, frequency: 'Real-time', isActive: true });
  };

  const handleRemoveMetric = (idx: number) => {
    const currentMetrics = [...(formData.metrics || [])];
    currentMetrics.splice(idx, 1);
    setFormData({ ...formData, metrics: currentMetrics });
  };

  if (loading && !sla) return <div style={{ color: '#aaa', textAlign: 'center', padding: '5rem' }}>Loading SLA details...</div>;
  if (!sla) return <div style={{ color: '#fa5252', textAlign: 'center', padding: '5rem' }}>SLA not found.</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <AdminModal {...modal} onCancel={() => setModal({ ...modal, isOpen: false })} />
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button onClick={onBack} style={{ padding: '0.6rem 1rem', background: 'transparent', border: '1px solid #444', color: '#aaa', borderRadius: '8px', cursor: 'pointer' }}>← Back to List</button>
          <h2 style={{ color: '#fff', margin: 0 }}>Agreement Details: {sla.name}</h2>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={handleUpdate} style={{ padding: '0.6rem 1.2rem', backgroundColor: '#339af0', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>SAVE CHANGES</button>
          <button onClick={async () => { if (window.confirm('Delete this SLA?')) { const ok = await deleteSla(); if (ok) onDeleted(); } }} style={{ padding: '0.6rem 1.2rem', backgroundColor: 'transparent', border: '1px solid #fa5252', color: '#fa5252', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>DELETE SLA</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <section style={{ backgroundColor: '#1a1a1a', padding: '2rem', borderRadius: '12px', border: '1px solid #333' }}>
            <h3 style={{ color: '#339af0', marginTop: 0, marginBottom: '1.5rem', borderBottom: '1px solid #333', paddingBottom: '0.5rem' }}>General Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ color: '#888', display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem' }}>Status</label>
                <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as SlaStatus})} style={{ width: '100%', padding: '0.8rem', backgroundColor: '#111', color: '#fff', border: '1px solid #333', borderRadius: '8px' }}>
                  <option value="SLA_DRAFT">DRAFT</option>
                  <option value="SLA_ACTIVE">ACTIVE</option>
                  <option value="SLA_INACTIVE">INACTIVE</option>
                  <option value="SLA_EXPIRED">EXPIRED</option>
                </select>
              </div>
              <div>
                <label style={{ color: '#888', display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem' }}>Customer Name</label>
                <input value={formData.customerName || ''} onChange={e => setFormData({...formData, customerName: e.target.value})} style={{ width: '100%', padding: '0.8rem', backgroundColor: '#111', color: '#fff', border: '1px solid #333', borderRadius: '8px' }} />
              </div>
              <div>
                <label style={{ color: '#888', display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem' }}>Service Hours</label>
                <input value={formData.serviceHours || ''} onChange={e => setFormData({...formData, serviceHours: e.target.value})} placeholder="e.g., 24x7 Support" style={{ width: '100%', padding: '0.8rem', backgroundColor: '#111', color: '#fff', border: '1px solid #333', borderRadius: '8px' }} />
              </div>
              <div>
                <label style={{ color: '#888', display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem' }}>Start/End Data Range</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                   <input type="date" value={formData.startDate?.split('T')[0] || ''} onChange={e => setFormData({...formData, startDate: e.target.value})} style={{ flex: 1, padding: '0.8rem', backgroundColor: '#111', color: '#fff', border: '1px solid #333', borderRadius: '8px' }} />
                   <input type="date" value={formData.endDate?.split('T')[0] || ''} onChange={e => setFormData({...formData, endDate: e.target.value})} style={{ flex: 1, padding: '0.8rem', backgroundColor: '#111', color: '#fff', border: '1px solid #333', borderRadius: '8px' }} />
                </div>
              </div>
            </div>
          </section>

          <section style={{ backgroundColor: '#1a1a1a', padding: '2rem', borderRadius: '12px', border: '1px solid #333' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #333', paddingBottom: '0.5rem' }}>
               <h3 style={{ color: '#51cf66', margin: 0 }}>Service Level Metrics (SLOs)</h3>
               <button onClick={() => setShowMetricForm(true)} style={{ padding: '0.4rem 0.8rem', backgroundColor: '#51cf66', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}>+ ADD METRIC</button>
            </div>

            {showMetricForm && (
              <div style={{ padding: '1.5rem', backgroundColor: '#252525', borderRadius: '8px', marginBottom: '2rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <input placeholder="Metric Name (e.g., Uptime)" value={newMetric.name} onChange={e => setNewMetric({...newMetric, name: e.target.value})} style={{ padding: '0.7rem', backgroundColor: '#111', color: '#fff', border: '1px solid #444', borderRadius: '4px' }} />
                  <input placeholder="Target Value (e.g., 99.9)" type="number" step="0.01" value={newMetric.targetValue} onChange={e => setNewMetric({...newMetric, targetValue: Number(e.target.value)})} style={{ padding: '0.7rem', backgroundColor: '#111', color: '#fff', border: '1px solid #444', borderRadius: '4px' }} />
                  <input placeholder="Unit (e.g., %)" value={newMetric.unit} onChange={e => setNewMetric({...newMetric, unit: e.target.value})} style={{ padding: '0.7rem', backgroundColor: '#111', color: '#fff', border: '1px solid #444', borderRadius: '4px' }} />
                  <select value={newMetric.frequency} onChange={e => setNewMetric({...newMetric, frequency: e.target.value})} style={{ padding: '0.7rem', backgroundColor: '#111', color: '#fff', border: '1px solid #444', borderRadius: '4px' }}>
                    <option value="Real-time">Real-time</option>
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                  </select>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button onClick={handleAddMetric} style={{ flex: 1, padding: '0.75rem', backgroundColor: '#51cf66', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>ADD TO LIST</button>
                  <button onClick={() => setShowMetricForm(false)} style={{ flex: 1, padding: '0.75rem', backgroundColor: 'transparent', border: '1px solid #444', color: '#aaa', borderRadius: '4px', cursor: 'pointer' }}>CANCEL</button>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {formData.metrics?.map((m, idx) => (
                <div key={idx} style={{ padding: '1rem', backgroundColor: '#111', borderRadius: '8px', border: '1px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ color: '#fff', fontWeight: 'bold' }}>{m.name}</div>
                    <div style={{ color: '#888', fontSize: '0.8rem' }}>Target: {m.targetValue}{m.unit} | {m.frequency}</div>
                  </div>
                  <button onClick={() => handleRemoveMetric(idx)} style={{ color: '#fa5252', background: 'transparent', border: 'none', cursor: 'pointer' }}>Remove</button>
                </div>
              ))}
              {(!formData.metrics || formData.metrics.length === 0) && <div style={{ color: '#555', textAlign: 'center', padding: '2rem' }}>No metrics defined for this agreement.</div>}
            </div>
          </section>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <section style={{ backgroundColor: '#1a1a1a', padding: '1.5rem', borderRadius: '12px', border: '1px solid #333' }}>
            <h3 style={{ color: '#fff', marginTop: 0, marginBottom: '1.2rem', fontSize: '1rem' }}>SLA Attributes</h3>
            <div style={{ color: '#888', fontSize: '0.8rem', lineHeight: '1.8' }}>
              <div>• Compliance Target: <b>100%</b></div>
              <div>• Reporting Cycle: <b>Monthly</b></div>
              <div>• Review Required: <b>Yes</b></div>
            </div>
          </section>
          <section style={{ backgroundColor: '#1a1a1a', padding: '1.5rem', borderRadius: '12px', border: '1px solid #333', color: '#555', fontSize: '0.75rem' }}>
            <div>Created: {new Date(sla.createdAt || '').toLocaleString()}</div>
            <div>Updated: {new Date(sla.updatedAt || '').toLocaleString()}</div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SlaDetailView;
