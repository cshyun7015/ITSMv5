import { useState, useEffect } from 'react';

export default function RequestForm({ user, catalogId, onBack }: { user: any, catalogId: number, onBack: () => void }) {
  const [catalog, setCatalog] = useState<any>(null);
  const [formSchema, setFormSchema] = useState<any[]>([]);
  const [formData, setFormData] = useState<any>({});
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => {
    const fetchCatalog = async () => {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      const token = localStorage.getItem('itsm_token');
      try {
        const response = await fetch(`${apiUrl}/api/catalog/${catalogId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setCatalog(data);
          if (data.formSchema) {
            setFormSchema(JSON.parse(data.formSchema));
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchCatalog();
  }, [catalogId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg('Submitting...');
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
    const token = localStorage.getItem('itsm_token');

    const payload = {
      catalogId,
      requesterId: user.userId,
      title,
      description,
      formData: JSON.stringify(formData)
    };

    try {
      const response = await fetch(`${apiUrl}/api/requests`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        setStatusMsg('Successfully submitted! Returning to catalog...');
        setTimeout(onBack, 2000);
      } else {
        setStatusMsg('Failed to submit request.');
      }
    } catch (err) {
      setStatusMsg('Error: ' + err);
    }
  };

  if (!catalog) return <div style={{ color: '#fff' }}>Loading form template...</div>;

  return (
    <div style={{ backgroundColor: '#1e1e1e', padding: '2.5rem', borderRadius: '12px', border: '1px solid #333', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
      <button onClick={onBack} style={{ backgroundColor: 'transparent', border: 'none', color: '#fcc419', cursor: 'pointer', marginBottom: '1.5rem', padding: 0, fontSize: '1rem' }}>
        &larr; Back to Catalog List
      </button>
      
      <h3 style={{ color: '#fff', marginBottom: '0.5rem', fontSize: '1.6rem' }}>{catalog.catalogName}</h3>
      <p style={{ color: '#aaa', marginBottom: '2.5rem' }}>{catalog.description}</p>
      
      {statusMsg && <div style={{ color: '#51cf66', marginBottom: '1.5rem', padding: '1rem', backgroundColor: 'rgba(81, 207, 102, 0.1)', borderRadius: '6px', fontWeight: 'bold' }}>{statusMsg}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '700px' }}>
        
        <div>
          <label style={{ display: 'block', color: '#ccc', marginBottom: '0.5rem', fontWeight: 'bold' }}>Request Title <span style={{color: '#ff6b6b'}}>*</span></label>
          <input required type="text" value={title} onChange={e => setTitle(e.target.value)} style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid #555', backgroundColor: '#2c2c2c', color: '#fff', fontSize: '1rem' }} />
        </div>

        <div>
          <label style={{ display: 'block', color: '#ccc', marginBottom: '0.5rem', fontWeight: 'bold' }}>Detailed Description</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid #555', backgroundColor: '#2c2c2c', color: '#fff', fontSize: '1rem', fontFamily: 'inherit' }} />
        </div>

        {/* Dynamic Form Rendering */}
        {formSchema.length > 0 && (
          <div style={{ marginTop: '1rem', paddingTop: '1.5rem', borderTop: '1px solid #333' }}>
            <h4 style={{ color: '#339af0', marginBottom: '1.5rem' }}>Specific Catalog Requirements</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {formSchema.map((field: any, idx: number) => (
                <div key={idx}>
                  <label style={{ display: 'inline-block', color: '#ccc', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    {field.label} {field.type === 'checkbox' && (
                       <input type="checkbox" onChange={(e) => setFormData({...formData, [field.name]: e.target.checked})} style={{ transform: 'scale(1.2)', marginLeft: '0.5rem' }} />
                    )}
                  </label>
                  {field.type === 'text' && (
                    <input type="text" onChange={(e) => setFormData({...formData, [field.name]: e.target.value})} style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid #555', backgroundColor: '#2c2c2c', color: '#fff', fontSize: '1rem' }} />
                  )}
                  {field.type === 'textarea' && (
                    <textarea onChange={(e) => setFormData({...formData, [field.name]: e.target.value})} rows={3} style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid #555', backgroundColor: '#2c2c2c', color: '#fff', fontSize: '1rem', fontFamily: 'inherit' }} />
                  )}
                  {field.type === 'select' && (
                    <select onChange={(e) => setFormData({...formData, [field.name]: e.target.value})} style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid #555', backgroundColor: '#2c2c2c', color: '#fff', fontSize: '1rem' }}>
                      <option value="">-- Select --</option>
                      {field.options?.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <button type="submit" style={{ padding: '1rem', borderRadius: '6px', border: 'none', backgroundColor: '#339af0', color: '#fff', fontWeight: 'bold', cursor: 'pointer', marginTop: '1rem', fontSize: '1.1rem', transition: 'background-color 0.2s' }}>
          Submit Request
        </button>
      </form>
    </div>
  );
}
