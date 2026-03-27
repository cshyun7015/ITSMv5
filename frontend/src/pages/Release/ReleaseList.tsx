import { useState } from 'react';

export default function ReleaseList({ user }: { user: any }) {
  const [releases, setReleases] = useState<any[]>([
    { id: 'REL-001', title: 'Q1 System Update', status: 'PLANNED', date: '2026-04-10' },
    { id: 'REL-002', title: 'Security Patch v2.1', status: 'IN_PROGRESS', date: '2026-03-30' }
  ]);

  return (
    <div style={{ padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ color: '#fff' }}>Release Management (Phase 14)</h3>
        <button style={{ padding: '0.7rem 1.5rem', backgroundColor: '#339af0', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>
          + New Release Plan
        </button>
      </div>
      <div style={{ backgroundColor: '#1e1e1e', borderRadius: '12px', border: '1px solid #333', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', color: '#e0e0e0' }}>
          <thead>
            <tr style={{ backgroundColor: '#252525', textAlign: 'left', borderBottom: '1px solid #333' }}>
              <th style={{ padding: '1.2rem' }}>Release ID</th>
              <th style={{ padding: '1.2rem' }}>Title</th>
              <th style={{ padding: '1.2rem' }}>Status</th>
              <th style={{ padding: '1.2rem' }}>Target Date</th>
            </tr>
          </thead>
          <tbody>
            {releases.map(rel => (
              <tr key={rel.id} style={{ borderBottom: '1px solid #2a2a2a' }}>
                <td style={{ padding: '1.2rem', color: '#339af0', fontWeight: 'bold' }}>{rel.id}</td>
                <td style={{ padding: '1.2rem' }}>{rel.title}</td>
                <td style={{ padding: '1.2rem' }}>
                  <span style={{ color: rel.status === 'PLANNED' ? '#888' : '#51cf66' }}>● {rel.status}</span>
                </td>
                <td style={{ padding: '1.2rem' }}>{rel.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
