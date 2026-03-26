import { useState, useEffect } from 'react';

export default function AssetList({ user }: { user: any }) {
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingAsset, setEditingAsset] = useState<any | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [newAsset, setNewAsset] = useState({ name: '', type: 'Server', status: 'Active', location: '', owner: '' });

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';

  const fetchAssets = async () => {
    try {
      const token = localStorage.getItem('itsm_token');
      const res = await fetch(`${apiUrl}/api/cmdb`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setAssets(await res.json());
      } else {
        console.error("Failed to fetch assets:", res.status, res.statusText);
      }
    } catch (e) {
      console.error("Failed to load assets:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('itsm_token');
      const res = await fetch(`${apiUrl}/api/cmdb`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(newAsset)
      });
      if (res.ok) {
        setShowForm(false);
        setNewAsset({ name: '', type: 'Server', status: 'Active', location: '', owner: '' });
        fetchAssets();
      } else {
        console.error("Failed to create asset:", res.status, res.statusText);
      }
    } catch (e) {
      console.error("Error creating asset:", e);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAsset) return;
    try {
      const token = localStorage.getItem('itsm_token');
      const res = await fetch(`${apiUrl}/api/cmdb/${editingAsset.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(editingAsset)
      });
      if (res.ok) {
        setEditingAsset(null);
        fetchAssets();
      } else {
        console.error("Failed to update asset:", res.status, res.statusText);
      }
    } catch (e) {
      console.error("Error updating asset:", e);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    try {
      const token = localStorage.getItem('itsm_token');
      const res = await fetch(`${apiUrl}/api/cmdb/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchAssets();
      } else {
        console.error("Failed to delete asset:", res.status, res.statusText);
      }
    } catch (e) {
      console.error("Error deleting asset:", e);
    }
  };

  const filteredAssets = assets.filter(asset =>
    asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.serialNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.owner?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div style={{ color: '#fff' }}>Loading IT Assets...</div>;

  return (
    <div style={{ padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ color: '#fff', margin: 0 }}>IT Asset Management (ITAM)</h2>
        <button onClick={() => setShowForm(!showForm)} style={{ padding: '0.7rem 1.5rem', borderRadius: '8px', border: 'none', backgroundColor: '#339af0', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>
          {showForm ? 'Cancel' : '+ New Asset'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} style={{ backgroundColor: '#1e1e1e', padding: '1.5rem', borderRadius: '12px', border: '1px solid #333', marginBottom: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <input required placeholder="Asset Name" value={newAsset.name} onChange={e => setNewAsset({ ...newAsset, name: e.target.value })} style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid #444', backgroundColor: '#2c2c2c', color: '#fff' }} />
          <select value={newAsset.type} onChange={e => setNewAsset({ ...newAsset, type: e.target.value })} style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid #444', backgroundColor: '#2c2c2c', color: '#fff' }}>
            <option>Server</option><option>Database</option><option>Network</option><option>Application</option><option>Storage</option>
          </select>
          <input placeholder="Location" value={newAsset.location} onChange={e => setNewAsset({ ...newAsset, location: e.target.value })} style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid #444', backgroundColor: '#2c2c2c', color: '#fff' }} />
          <input placeholder="Owner" value={newAsset.owner} onChange={e => setNewAsset({ ...newAsset, owner: e.target.value })} style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid #444', backgroundColor: '#2c2c2c', color: '#fff' }} />
          <button type="submit" style={{ padding: '0.8rem', borderRadius: '6px', border: 'none', backgroundColor: '#51cf66', color: '#000', fontWeight: 'bold', cursor: 'pointer' }}>Create Asset</button>
        </form>
      )}

      {editingAsset && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <form onSubmit={handleUpdate} style={{ backgroundColor: '#1e1e1e', padding: '2rem', borderRadius: '12px', width: '400px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ color: '#fff', marginTop: 0 }}>Edit Asset</h3>
            <input required value={editingAsset.name} onChange={e => setEditingAsset({ ...editingAsset, name: e.target.value })} style={{ padding: '0.8rem', borderRadius: '6px', backgroundColor: '#2c2c2c', color: '#fff', border: '1px solid #444' }} />
            <select value={editingAsset.type} onChange={e => setEditingAsset({ ...editingAsset, type: e.target.value })} style={{ padding: '0.8rem', borderRadius: '6px', backgroundColor: '#2c2c2c', color: '#fff', border: '1px solid #444' }}>
              <option>Server</option><option>Database</option><option>Network</option><option>Application</option><option>Storage</option>
            </select>
            <input value={editingAsset.location} onChange={e => setEditingAsset({ ...editingAsset, location: e.target.value })} style={{ padding: '0.8rem', borderRadius: '6px', backgroundColor: '#2c2c2c', color: '#fff', border: '1px solid #444' }} />
            <input value={editingAsset.owner} onChange={e => setEditingAsset({ ...editingAsset, owner: e.target.value })} style={{ padding: '0.8rem', borderRadius: '6px', backgroundColor: '#2c2c2c', color: '#fff', border: '1px solid #444' }} />
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button type="submit" style={{ flex: 1, padding: '0.8rem', borderRadius: '6px', backgroundColor: '#339af0', border: 'none', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>Update</button>
              <button type="button" onClick={() => setEditingAsset(null)} style={{ flex: 1, padding: '0.8rem', borderRadius: '6px', backgroundColor: '#444', border: 'none', color: '#fff', cursor: 'pointer' }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div style={{ marginBottom: '1.5rem' }}>
        <input
          type="text"
          placeholder="Search assets by name, type, SN, location, or owner..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: '0.8rem 1.2rem',
            borderRadius: '8px',
            border: '1px solid #444',
            backgroundColor: '#1a1a1a',
            color: '#fff',
            width: '100%',
            maxWidth: '400px',
            outline: 'none'
          }}
        />
      </div>

      <div style={{ backgroundColor: '#1a1a1a', borderRadius: '12px', border: '1px solid #333', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', color: '#e0e0e0' }}>
          <thead>
            <tr style={{ backgroundColor: '#252525', textAlign: 'left', borderBottom: '1px solid #333' }}>
              <th style={{ padding: '1.2rem' }}>Name</th>
              <th style={{ padding: '1.2rem' }}>Type</th>
              <th style={{ padding: '1.2rem' }}>Status</th>
              <th style={{ padding: '1.2rem' }}>Serial Number</th>
              <th style={{ padding: '1.2rem' }}>Location</th>
              <th style={{ padding: '1.2rem' }}>Owner</th>
              <th style={{ padding: '1.2rem', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAssets.map((asset: any) => (
              <tr key={asset.id} style={{ borderBottom: '1px solid #2a2a2a', transition: 'background 0.2s' }}>
                <td style={{ padding: '1.2rem', fontWeight: 'bold' }}>{asset.name}</td>
                <td style={{ padding: '1.2rem' }}>
                  <span style={{
                    padding: '0.3rem 0.6rem',
                    borderRadius: '4px',
                    backgroundColor: '#333',
                    fontSize: '0.8rem',
                    color: '#339af0'
                  }}>
                    {asset.type}
                  </span>
                </td>
                <td style={{ padding: '1.2rem' }}>
                  <span style={{
                    color: asset.status === 'IN_USE' || asset.status === 'Active' ? '#51cf66' : '#fcc419',
                    fontSize: '0.9rem'
                  }}>
                    ● {asset.status}
                  </span>
                </td>
                <td style={{ padding: '1.2rem', color: '#888', fontFamily: 'monospace' }}>{asset.serialNumber}</td>
                <td style={{ padding: '1.2rem' }}>{asset.location}</td>
                <td style={{ padding: '1.2rem', color: '#888', fontSize: '0.9rem' }}>
                  {new Date(asset.updatedAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredAssets.length === 0 && (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#888' }}>
            No assets found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}
