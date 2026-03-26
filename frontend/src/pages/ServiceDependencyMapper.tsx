import { useState, useEffect } from 'react';

export default function ServiceDependencyMapper({ serviceId, onBack }: { serviceId: number, onBack: () => void }) {
  const [assets, setAssets] = useState<any[]>([]);
  const [selectedAssetIds, setSelectedAssetIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
    const token = localStorage.getItem('itsm_token');
    try {
      // Fetch all assets
      const assetRes = await fetch(`${apiUrl}/api/assets`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (assetRes.ok) setAssets(await assetRes.json());

      // Fetch existing mapping
      const depRes = await fetch(`${apiUrl}/api/services/${serviceId}/dependencies`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (depRes.ok) {
        const deps = await depRes.json();
        setSelectedAssetIds(deps.map((d: any) => d.assetId));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [serviceId]);

  const toggleAsset = (assetId: number) => {
    setSelectedAssetIds(prev => 
      prev.includes(assetId) ? prev.filter(id => id !== assetId) : [...prev, assetId]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
    const token = localStorage.getItem('itsm_token');
    try {
      const res = await fetch(`${apiUrl}/api/services/${serviceId}/dependencies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(selectedAssetIds)
      });
      if (res.ok) alert('Dependencies updated successfully!');
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ color: '#fff' }}>Loading configuration items...</div>;

  return (
    <div style={{ backgroundColor: '#1e1e1e', padding: '2rem', borderRadius: '12px', border: '1px solid #333' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h3 style={{ color: '#fff', margin: 0 }}>Map Infrastructure to Service (BIA Configuration)</h3>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', textDecoration: 'underline' }}>← Back to Portfolio</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {assets.map(asset => {
          const isSelected = selectedAssetIds.includes(asset.id);
          return (
            <div 
              key={asset.id} 
              onClick={() => toggleAsset(asset.id)}
              style={{ 
                padding: '1rem', 
                borderRadius: '8px', 
                border: isSelected ? '1px solid #339af0' : '1px solid #444', 
                backgroundColor: isSelected ? '#339af011' : '#2c2c2c', 
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ fontWeight: 'bold', fontSize: '0.9rem', color: isSelected ? '#339af0' : '#fff' }}>{asset.assetName}</div>
              <div style={{ fontSize: '0.7rem', color: '#888' }}>ID: {asset.assetTag} | {asset.category}</div>
            </div>
          );
        })}
      </div>

      <button 
        disabled={saving} 
        onClick={handleSave} 
        style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: 'none', backgroundColor: '#339af0', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}
      >
        {saving ? 'Saving...' : 'Save Service-CI Dependencies'}
      </button>
    </div>
  );
}
