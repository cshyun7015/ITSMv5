import { useState, useEffect } from 'react';

export default function AssetList({ user }: { user: any }) {
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchAssets = async () => {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      const token = localStorage.getItem('itsm_token');
      try {
        const response = await fetch(`${apiUrl}/api/cmdb`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          setAssets(await response.json());
        }
      } catch (err) {
        console.error("Failed to load assets:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAssets();
  }, []);

  const filteredAssets = assets.filter(asset => 
    asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.serialNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div style={{ color: '#fff' }}>Loading IT Assets...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <input 
          type="text" 
          placeholder="Search assets by name, type, or SN..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ 
            padding: '0.8rem 1.2rem', 
            borderRadius: '8px', 
            border: '1px solid #444', 
            backgroundColor: '#1a1a1a', 
            color: '#fff', 
            width: '350px',
            outline: 'none'
          }}
        />
        <button style={{ 
          padding: '0.8rem 1.5rem', 
          backgroundColor: '#339af0', 
          color: '#fff', 
          border: 'none', 
          borderRadius: '8px', 
          fontWeight: 'bold', 
          cursor: 'pointer' 
        }}>
          + Register New Asset
        </button>
      </div>

      <div style={{ backgroundColor: '#1e1e1e', borderRadius: '12px', border: '1px solid #333', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', color: '#e0e0e0' }}>
          <thead>
            <tr style={{ backgroundColor: '#252525', textAlign: 'left', borderBottom: '1px solid #333' }}>
              <th style={{ padding: '1.2rem' }}>Name</th>
              <th style={{ padding: '1.2rem' }}>Type</th>
              <th style={{ padding: '1.2rem' }}>Status</th>
              <th style={{ padding: '1.2rem' }}>Serial Number</th>
              <th style={{ padding: '1.2rem' }}>Location</th>
              <th style={{ padding: '1.2rem' }}>Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {filteredAssets.map(asset => (
              <tr key={asset.id} style={{ borderBottom: '1px solid #2a2a2a', hover: {backgroundColor: '#252525'} }}>
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
                    color: asset.status === 'IN_USE' ? '#51cf66' : '#fcc419',
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
