import React from 'react';
import { useSlas } from '../../SLA/hooks/useSlas';

const SlaMonitor: React.FC = () => {
    const { slas, loading } = useSlas();
    const activeSlas = slas.filter(s => s.status === 'SLA_ACTIVE');

    if (loading) return <div style={{ color: '#888' }}>SLA 상태 분석 중...</div>;
    if (activeSlas.length === 0) return <div style={{ color: '#444', fontSize: '0.85rem' }}>활성화된 SLA가 없습니다.</div>;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h4 style={{ color: '#aaa', margin: '0 0 1rem 0', fontSize: '0.9rem', fontWeight: 600 }}>활성 SLA 건전성 (SLO Compliance)</h4>
            {activeSlas.map(sla => (
                <div key={sla.id} style={{ backgroundColor: '#1a1a1a', padding: '1rem', borderRadius: '8px', border: '1px solid #333' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 'bold' }}>{sla.name}</span>
                        <span style={{ color: '#51cf66', fontSize: '0.8rem', fontWeight: 800 }}>99.9%</span>
                    </div>
                    {/* Mock Progress Bar */}
                    <div style={{ height: '6px', width: '100%', backgroundColor: '#333', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: '99.9%', height: '100%', backgroundColor: '#51cf66', borderRadius: '3px' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.4rem' }}>
                        <span style={{ color: '#555', fontSize: '0.7rem' }}>Customer: {sla.customerName}</span>
                        <span style={{ color: '#555', fontSize: '0.7rem' }}>Target: {sla.metrics?.[0]?.targetValue || 99}{sla.metrics?.[0]?.unit || '%'}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SlaMonitor;
